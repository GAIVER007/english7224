export type TranslationLanguage = "ru" | "en";

export const MAX_TRANSLATION_BYTES = 500;
export const MAX_TRANSLATION_BODY_BYTES = 4_096;
export const TRANSLATION_TIMEOUT_MS = 8_000;

const MYMEMORY_ENDPOINT = "https://api.mymemory.translated.net/get";
const utf8 = new TextEncoder();

interface TranslationRequestBody {
  text: string;
  source: TranslationLanguage;
}

interface MyMemoryResponse {
  responseData?: { translatedText?: unknown };
  responseStatus?: unknown;
  quotaFinished?: unknown;
}

class RequestError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

function json(body: object, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function readBoundedBody(request: Request): Promise<string> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_TRANSLATION_BODY_BYTES) {
    throw new RequestError(413, "Запрос слишком большой.");
  }
  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let result = "";
  try {
    while (true) {
      if (request.signal.aborted) throw new RequestError(499, "Запрос отменён.");
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > MAX_TRANSLATION_BODY_BYTES) {
        await reader.cancel();
        throw new RequestError(413, "Запрос слишком большой.");
      }
      result += decoder.decode(chunk.value, { stream: true });
    }
    result += decoder.decode();
    return result;
  } finally {
    reader.releaseLock();
  }
}

async function parseRequest(request: Request): Promise<TranslationRequestBody> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    throw new RequestError(415, "Отправьте запрос в формате JSON.");
  }

  let value: unknown;
  try {
    value = JSON.parse(await readBoundedBody(request));
  } catch (error) {
    if (error instanceof RequestError) throw error;
    if (request.signal.aborted) throw new RequestError(499, "Запрос отменён.");
    throw new RequestError(400, "Не удалось прочитать JSON запроса.");
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new RequestError(400, "Тело запроса должно быть объектом JSON.");
  }
  const body = value as Record<string, unknown>;
  if (typeof body["text"] !== "string" || !body["text"].trim()) {
    throw new RequestError(400, "Введите текст для перевода.");
  }
  if (body["source"] !== "ru" && body["source"] !== "en") {
    throw new RequestError(400, "Язык перевода должен быть ru или en.");
  }
  const text = body["text"].trim();
  if (utf8.encode(text).byteLength > MAX_TRANSLATION_BYTES) {
    throw new RequestError(413, "Текст слишком длинный. Максимум — 500 байт UTF-8.");
  }
  return { text, source: body["source"] };
}

function isQuotaResponse(status: unknown, quotaFinished: unknown): boolean {
  const numericStatus = typeof status === "string" ? Number(status) : status;
  return (
    quotaFinished === true ||
    quotaFinished === "true" ||
    quotaFinished === 1 ||
    numericStatus === 403 ||
    numericStatus === 429
  );
}

export async function handleTranslationRequest(request: Request): Promise<Response> {
  const requestOrigin = new URL(request.url).origin;
  const origin = request.headers.get("origin");
  if (!origin || origin !== requestOrigin) {
    return json({ error: "Перевод доступен только из приложения SpeakUp." }, 403);
  }

  let input: TranslationRequestBody;
  try {
    input = await parseRequest(request);
  } catch (error) {
    if (error instanceof RequestError) return json({ error: error.message }, error.status);
    return json({ error: "Не удалось обработать запрос на перевод." }, 400);
  }

  const target: TranslationLanguage = input.source === "ru" ? "en" : "ru";
  const url = new URL(MYMEMORY_ENDPOINT);
  url.searchParams.set("q", input.text);
  url.searchParams.set("langpair", `${input.source}|${target}`);

  const controller = new AbortController();
  let timedOut = false;
  const abortProvider = () => controller.abort(request.signal.reason);
  if (request.signal.aborted) abortProvider();
  else request.signal.addEventListener("abort", abortProvider, { once: true });
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort(new DOMException("Translation timed out", "TimeoutError"));
  }, TRANSLATION_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (response.status === 403 || response.status === 429) {
      return json({ error: "Лимит переводов на сегодня исчерпан. Попробуйте позже." }, 429);
    }
    if (!response.ok) {
      return json({ error: "Сервис перевода временно недоступен." }, 502);
    }

    let provider: MyMemoryResponse;
    try {
      provider = (await response.json()) as MyMemoryResponse;
    } catch {
      return json({ error: "Сервис перевода вернул некорректный ответ." }, 502);
    }
    if (isQuotaResponse(provider.responseStatus, provider.quotaFinished)) {
      return json({ error: "Лимит переводов на сегодня исчерпан. Попробуйте позже." }, 429);
    }
    const providerStatus =
      typeof provider.responseStatus === "string"
        ? Number(provider.responseStatus)
        : provider.responseStatus;
    if (providerStatus !== undefined && providerStatus !== 200) {
      return json({ error: "Сервис перевода не смог обработать запрос." }, 502);
    }
    const translatedText = provider.responseData?.translatedText;
    if (typeof translatedText !== "string" || !translatedText.trim()) {
      return json({ error: "Сервис перевода не вернул перевод." }, 502);
    }

    return json({
      translation: translatedText.trim(),
      source: input.source,
      target,
      provider: "MyMemory",
    });
  } catch {
    if (request.signal.aborted) return json({ error: "Запрос на перевод отменён." }, 499);
    if (timedOut) return json({ error: "Сервис перевода не ответил вовремя." }, 504);
    return json({ error: "Не удалось связаться с сервисом перевода." }, 502);
  } finally {
    clearTimeout(timeout);
    request.signal.removeEventListener("abort", abortProvider);
  }
}
