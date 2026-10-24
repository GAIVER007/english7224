import {
  OfflineTranslatorError,
  type OfflineModelProgress,
  type OfflineTranslationLanguage,
  type OfflineWorkerRequest,
  type OfflineWorkerResponse,
} from "./offline-translator.shared";

export { OfflineTranslatorError, chunkTranslationText } from "./offline-translator.shared";
export type {
  OfflineModelProgress,
  OfflineTranslationLanguage,
  OfflineTranslatorErrorCode,
  OfflineWorkerRequest,
  OfflineWorkerResponse,
  TranslationTextChunk,
} from "./offline-translator.shared";

type OfflineWorkerOperation =
  | { type: "install" }
  | { type: "status" }
  | { type: "translate"; text: string; source: OfflineTranslationLanguage };

interface WorkerMessageEvent {
  data: OfflineWorkerResponse;
}

export interface OfflineWorkerLike {
  postMessage(message: OfflineWorkerRequest): void;
  addEventListener(type: "message", listener: (event: WorkerMessageEvent) => void): void;
  addEventListener(type: "error", listener: () => void): void;
}

interface PendingRequest {
  resolve(value: string | boolean | null): void;
  reject(reason: OfflineTranslatorError): void;
  onProgress?: (progress: OfflineModelProgress) => void;
  cleanup?: () => void;
}

export interface OfflineTranslatorClient {
  prepare(onProgress?: (progress: OfflineModelProgress) => void): Promise<void>;
  translate(
    text: string,
    source: OfflineTranslationLanguage,
    signal?: AbortSignal,
  ): Promise<string>;
  status(): Promise<boolean>;
}

export function createOfflineTranslatorClient(
  workerFactory: () => OfflineWorkerLike,
): OfflineTranslatorClient {
  let worker: OfflineWorkerLike | null = null;
  let nextId = 1;
  let installPromise: Promise<void> | null = null;
  const installListeners = new Set<(progress: OfflineModelProgress) => void>();
  const pending = new Map<number, PendingRequest>();

  function getWorker(): OfflineWorkerLike {
    if (worker) return worker;
    worker = workerFactory();
    worker.addEventListener("message", ({ data }) => {
      const request = pending.get(data.id);
      if (!request) return;
      if (data.type === "progress") {
        request.onProgress?.(data.progress);
        return;
      }
      pending.delete(data.id);
      request.cleanup?.();
      if (data.type === "error") {
        request.reject(new OfflineTranslatorError(data.code, data.message));
      } else {
        request.resolve(data.value);
      }
    });
    worker.addEventListener("error", () => {
      const error = new OfflineTranslatorError(
        "unavailable",
        "Офлайн-переводчик не запустился. Обнови страницу или используй другой современный браузер.",
      );
      for (const request of pending.values()) {
        request.cleanup?.();
        request.reject(error);
      }
      pending.clear();
      worker = null;
    });
    return worker;
  }

  function request(
    message: OfflineWorkerOperation,
    onProgress?: (progress: OfflineModelProgress) => void,
    signal?: AbortSignal,
  ): Promise<string | boolean | null> {
    if (signal?.aborted) {
      return Promise.reject(new OfflineTranslatorError("aborted", "Перевод отменён."));
    }
    const activeWorker = getWorker();
    const id = nextId++;
    return new Promise((resolve, reject) => {
      const abort = () => {
        if (!pending.delete(id)) return;
        activeWorker.postMessage({ type: "cancel", id });
        reject(new OfflineTranslatorError("aborted", "Перевод отменён."));
      };
      const cleanup = signal ? () => signal.removeEventListener("abort", abort) : undefined;
      pending.set(id, {
        resolve,
        reject,
        ...(onProgress ? { onProgress } : {}),
        ...(cleanup ? { cleanup } : {}),
      });
      signal?.addEventListener("abort", abort, { once: true });
      activeWorker.postMessage({ ...message, id } as OfflineWorkerRequest);
    });
  }

  return {
    prepare(onProgress) {
      if (onProgress) installListeners.add(onProgress);
      if (!installPromise) {
        installPromise = request({ type: "install" }, (progress) => {
          for (const listener of installListeners) listener(progress);
        })
          .then(() => undefined)
          .finally(() => {
            installPromise = null;
            installListeners.clear();
          });
      }
      return installPromise;
    },
    async translate(text, source, signal) {
      const value = await request({ type: "translate", text, source }, undefined, signal);
      if (typeof value !== "string") {
        throw new OfflineTranslatorError(
          "translation-failed",
          "Модель вернула некорректный перевод.",
        );
      }
      return value;
    },
    async status() {
      const value = await request({ type: "status" });
      return value === true;
    },
  };
}

function createBrowserWorker(): OfflineWorkerLike {
  if (typeof Worker === "undefined") {
    throw new OfflineTranslatorError(
      "unavailable",
      "Офлайн-перевод работает в современном браузере с поддержкой Web Workers.",
    );
  }
  return new Worker(new URL("./offline-translator.worker.ts", import.meta.url), { type: "module" });
}

let browserClient: OfflineTranslatorClient | null = null;

function getBrowserClient(): OfflineTranslatorClient {
  browserClient ??= createOfflineTranslatorClient(createBrowserWorker);
  return browserClient;
}

export function prepareOfflineModels(
  onProgress?: (progress: OfflineModelProgress) => void,
): Promise<void> {
  return getBrowserClient().prepare(onProgress);
}

export function translateOffline(
  text: string,
  source: OfflineTranslationLanguage,
  signal?: AbortSignal,
): Promise<string> {
  return getBrowserClient().translate(text, source, signal);
}

export function getOfflineModelStatus(): Promise<boolean> {
  return getBrowserClient().status();
}
