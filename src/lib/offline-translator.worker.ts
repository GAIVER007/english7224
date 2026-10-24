/// <reference lib="webworker" />

import { env, pipeline } from "@huggingface/transformers";
import {
  chunkTranslationText,
  isCompletePinnedModelManifest,
  type OfflineModelProgress,
  type OfflineTranslationLanguage,
  type OfflineTranslatorErrorCode,
  type OfflineWorkerRequest,
  type OfflineWorkerResponse,
} from "./offline-translator.shared";

declare const self: DedicatedWorkerGlobalScope;

const MODEL_CACHE = "speakup-models-v1";
const MODEL_CONFIG: Record<OfflineTranslationLanguage, { id: string; revision: string }> = {
  ru: {
    id: "onnx-community/opus-mt-ru-en",
    // Last verified revision containing the q8 (*_quantized.onnx) graphs.
    revision: "2aa6e0c80ffcbac8d75f0c2fa2be4e0ee0e0e4d7",
  },
  en: {
    id: "onnx-community/opus-mt-en-ru",
    // Last verified revision containing the q8 (*_quantized.onnx) graphs.
    revision: "b33749cc48f33a6236ba93284d389e11c87c0f0e",
  },
};

type Translator = ((
  input: string,
  options: { max_new_tokens: number; num_beams: number },
) => Promise<unknown>) & {
  dispose(): Promise<void> | void;
};

interface ProgressPayload {
  status?: string;
  file?: string;
  progress?: number;
}

let translator: Translator | null = null;
let translatorSource: OfflineTranslationLanguage | null = null;
let modelCache: Cache | null = null;
let trackedConfig: { id: string; revision: string } | null = null;
let trackedFiles = new Set<string>();
let cacheWriteFailed = false;
const cancelled = new Set<number>();
const queue: Exclude<OfflineWorkerRequest, { type: "cancel" }>[] = [];
let processing = false;

function post(message: OfflineWorkerResponse) {
  self.postMessage(message);
}

function requestKey(request: RequestInfo | URL): string {
  if (typeof request === "string") return request;
  if (request instanceof URL) return request.href;
  return request.url;
}

function belongsToModel(key: string, config: { id: string; revision: string }): boolean {
  try {
    const url = new URL(key);
    return (
      url.origin === "https://huggingface.co" &&
      url.pathname.startsWith(`/${config.id}/resolve/${config.revision}/`)
    );
  } catch {
    return false;
  }
}

function manifestRequest(source: OfflineTranslationLanguage): Request {
  return new Request(new URL(`/__speakup-model-manifest/${source}`, self.location.origin));
}

async function configureRuntime(): Promise<void> {
  if (!("caches" in self)) {
    throw workerError(
      "unavailable",
      "Браузер не поддерживает хранилище Cache API, необходимое для офлайн-моделей.",
    );
  }
  if (modelCache) return;
  modelCache = await caches.open(MODEL_CACHE);

  const trackedCache = {
    async match(request: RequestInfo | URL): Promise<Response | undefined> {
      const response = await modelCache?.match(request);
      const key = requestKey(request);
      if (response && trackedConfig && belongsToModel(key, trackedConfig)) trackedFiles.add(key);
      return response;
    },
    async put(request: RequestInfo | URL, response: Response): Promise<void> {
      if (!modelCache) throw new Error("cache unavailable");
      const key = requestKey(request);
      try {
        await modelCache.put(request, response);
        if (trackedConfig && belongsToModel(key, trackedConfig)) trackedFiles.add(key);
      } catch (error) {
        if (trackedConfig && belongsToModel(key, trackedConfig)) cacheWriteFailed = true;
        throw error;
      }
    },
  };

  env.allowLocalModels = false;
  env.allowRemoteModels = true;
  env.useBrowserCache = true;
  env.useCustomCache = true;
  env.customCache = trackedCache;
  const wasm = env.backends.onnx.wasm;
  if (!wasm) {
    throw workerError("unavailable", "В этой сборке недоступен WebAssembly для офлайн-перевода.");
  }
  wasm.wasmPaths = "/onnx/";
  wasm.numThreads = 1;
  wasm.proxy = false;
}

interface WorkerFailure extends Error {
  code: OfflineTranslatorErrorCode;
}

function workerError(code: OfflineTranslatorErrorCode, message: string): WorkerFailure {
  return Object.assign(new Error(message), { code });
}

function publicFailure(error: unknown, fallbackCode: OfflineTranslatorErrorCode): WorkerFailure {
  if (error instanceof Error && "code" in error) return error as WorkerFailure;
  switch (fallbackCode) {
    case "download-failed":
      return workerError(
        fallbackCode,
        "Не удалось скачать языковые пакеты. Проверь интернет, свободное место и повтори загрузку.",
      );
    case "not-installed":
      return workerError(
        fallbackCode,
        "Языковые пакеты не найдены или были удалены браузером. Скачай их заново.",
      );
    default:
      return workerError(
        "translation-failed",
        "Не удалось выполнить перевод на устройстве. Попробуй ещё раз или переустанови языковые пакеты.",
      );
  }
}

async function disposeTranslator(): Promise<void> {
  if (!translator) return;
  const current = translator;
  translator = null;
  translatorSource = null;
  await current.dispose();
}

async function createTranslator(
  source: OfflineTranslationLanguage,
  localFilesOnly: boolean,
  progressCallback?: (payload: ProgressPayload) => void,
): Promise<Translator> {
  await configureRuntime();
  // v3.8.1 rejects allowLocalModels=false together with local_files_only=true.
  // Cache/local lookup is enabled for inference while all remote model access is disabled.
  env.allowLocalModels = localFilesOnly;
  env.allowRemoteModels = !localFilesOnly;
  if (translator && translatorSource === source) return translator;
  await disposeTranslator();
  const config = MODEL_CONFIG[source];
  const created = await pipeline("translation", config.id, {
    dtype: "q8",
    revision: config.revision,
    local_files_only: localFilesOnly,
    ...(progressCallback ? { progress_callback: progressCallback } : {}),
  });
  translator = created as unknown as Translator;
  translatorSource = source;
  return translator;
}

function progressFor(
  source: OfflineTranslationLanguage,
  payload: ProgressPayload,
): OfflineModelProgress {
  const raw = typeof payload.progress === "number" ? payload.progress : 0;
  return {
    phase:
      payload.status === "ready"
        ? "ready"
        : payload.status === "progress"
          ? "downloading"
          : "checking",
    source,
    progress: Math.max(0, Math.min(100, raw)),
    ...(payload.file ? { file: payload.file } : {}),
  };
}

async function saveManifest(source: OfflineTranslationLanguage): Promise<void> {
  if (!modelCache) throw new Error("cache unavailable");
  const files = [...trackedFiles].sort();
  if (cacheWriteFailed || !isCompletePinnedModelManifest(files, MODEL_CONFIG[source])) {
    throw new Error("model cache is incomplete");
  }
  await modelCache.put(
    manifestRequest(source),
    new Response(JSON.stringify({ version: 1, files }), {
      headers: { "content-type": "application/json" },
    }),
  );
}

async function isModelInstalled(source: OfflineTranslationLanguage): Promise<boolean> {
  await configureRuntime();
  if (!modelCache) return false;
  const manifestResponse = await modelCache.match(manifestRequest(source));
  if (!manifestResponse) return false;
  try {
    const manifest = (await manifestResponse.json()) as { version?: unknown; files?: unknown };
    if (manifest.version !== 1 || !Array.isArray(manifest.files) || manifest.files.length === 0)
      return false;
    const files = manifest.files.filter((file): file is string => typeof file === "string");
    if (
      files.length !== manifest.files.length ||
      !isCompletePinnedModelManifest(files, MODEL_CONFIG[source])
    )
      return false;
    const cached = await Promise.all(files.map((file) => modelCache?.match(file)));
    return cached.every(Boolean);
  } catch {
    return false;
  }
}

async function installModels(id: number): Promise<void> {
  for (const source of ["ru", "en"] as const) {
    const config = MODEL_CONFIG[source];
    trackedConfig = config;
    trackedFiles = new Set();
    cacheWriteFailed = false;
    post({
      type: "progress",
      id,
      progress: { phase: "checking", source, progress: 0 },
    });
    try {
      await disposeTranslator();
      await createTranslator(source, false, (payload) => {
        if (!cancelled.has(id)) {
          post({ type: "progress", id, progress: progressFor(source, payload) });
        }
      });
      await saveManifest(source);
      post({
        type: "progress",
        id,
        progress: { phase: "ready", source, progress: 100 },
      });
    } finally {
      trackedConfig = null;
      trackedFiles.clear();
      cacheWriteFailed = false;
      await disposeTranslator();
    }
  }
}

function translatedText(result: unknown): string {
  const candidate = Array.isArray(result) ? result[0] : result;
  if (
    candidate &&
    typeof candidate === "object" &&
    "translation_text" in candidate &&
    typeof candidate.translation_text === "string"
  ) {
    return candidate.translation_text.trim();
  }
  throw workerError("translation-failed", "Модель вернула некорректный перевод.");
}

async function translateText(
  id: number,
  text: string,
  source: OfflineTranslationLanguage,
): Promise<string> {
  if (cancelled.has(id)) throw workerError("aborted", "Перевод отменён.");
  if (!(await isModelInstalled(source))) {
    throw workerError(
      "not-installed",
      "Языковой пакет не найден или был удалён браузером. Скачай пакеты заново.",
    );
  }
  let activeTranslator: Translator;
  try {
    if (cancelled.has(id)) throw workerError("aborted", "Перевод отменён.");
    activeTranslator = await createTranslator(source, true);
  } catch (error) {
    throw publicFailure(error, "not-installed");
  }

  const chunks = chunkTranslationText(text);
  const translated: string[] = [];
  for (const chunk of chunks) {
    if (cancelled.has(id)) throw workerError("aborted", "Перевод отменён.");
    const result = await activeTranslator(chunk.text, { max_new_tokens: 256, num_beams: 1 });
    if (cancelled.has(id)) throw workerError("aborted", "Перевод отменён.");
    translated.push(`${translatedText(result)}${chunk.separator}`);
  }
  return translated.join("").trim();
}

async function handle(request: Exclude<OfflineWorkerRequest, { type: "cancel" }>): Promise<void> {
  if (cancelled.delete(request.id)) return;
  try {
    if (request.type === "install") {
      await installModels(request.id);
      if (!cancelled.delete(request.id)) post({ type: "result", id: request.id, value: null });
      return;
    }
    if (request.type === "status") {
      const installed = (await isModelInstalled("ru")) && (await isModelInstalled("en"));
      if (!cancelled.delete(request.id)) post({ type: "result", id: request.id, value: installed });
      return;
    }
    const value = await translateText(request.id, request.text, request.source);
    if (!cancelled.delete(request.id)) post({ type: "result", id: request.id, value });
  } catch (error) {
    if (cancelled.delete(request.id)) return;
    const failure = publicFailure(
      error,
      request.type === "install" ? "download-failed" : "translation-failed",
    );
    post({ type: "error", id: request.id, code: failure.code, message: failure.message });
  }
}

async function processQueue(): Promise<void> {
  if (processing) return;
  processing = true;
  try {
    while (queue.length > 0) {
      const request = queue.shift();
      if (request) await handle(request);
    }
  } finally {
    processing = false;
  }
}

self.addEventListener("message", (event) => {
  const request = event.data as OfflineWorkerRequest;
  if (request.type === "cancel") {
    cancelled.add(request.id);
    const queuedIndex = queue.findIndex((item) => item.id === request.id);
    if (queuedIndex >= 0) {
      queue.splice(queuedIndex, 1);
      cancelled.delete(request.id);
    }
    return;
  }

  if (request.type === "translate") {
    for (let index = queue.length - 1; index >= 0; index -= 1) {
      const queued = queue[index];
      if (queued?.type !== "translate") continue;
      queue.splice(index, 1);
      post({
        type: "error",
        id: queued.id,
        code: "superseded",
        message: "Этот перевод заменён более новым запросом.",
      });
    }
  }
  queue.push(request);
  void processQueue();
});
