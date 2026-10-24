import { afterEach, describe, expect, it, vi } from "vitest";
import {
  MAX_TRANSLATION_BODY_BYTES,
  TRANSLATION_TIMEOUT_MS,
  handleTranslationRequest,
} from "./translation-server";

function request(
  body: unknown,
  options: {
    origin?: string | null;
    signal?: AbortSignal;
    contentType?: string;
    raw?: boolean;
  } = {},
) {
  const origin = options.origin === undefined ? "https://speakup.test" : options.origin;
  return new Request("https://speakup.test/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": options.contentType ?? "application/json",
      ...(origin ? { Origin: origin } : {}),
    },
    body: options.raw ? String(body) : JSON.stringify(body),
    ...(options.signal ? { signal: options.signal } : {}),
  });
}

function providerResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("translation server", () => {
  it("uses the fixed anonymous MyMemory GET endpoint and returns a bounded response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      providerResponse({
        responseStatus: 200,
        quotaFinished: false,
        responseData: { translatedText: "Good morning" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await handleTranslationRequest(
      request({ text: "  Доброе утро  ", source: "ru" }, { origin: "https://speakup.test" }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({
      translation: "Good morning",
      source: "ru",
      target: "en",
      provider: "MyMemory",
    });
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.origin + url.pathname).toBe("https://api.mymemory.translated.net/get");
    expect(url.searchParams.get("q")).toBe("Доброе утро");
    expect(url.searchParams.get("langpair")).toBe("ru|en");
    expect(url.searchParams.has("key")).toBe(false);
    expect(url.searchParams.has("ip")).toBe(false);
    expect(url.searchParams.has("de")).toBe(false);
    expect(url.searchParams.has("user")).toBe(false);
    expect(init).toMatchObject({ method: "GET", headers: { Accept: "application/json" } });
  });

  it("rejects cross-origin requests before contacting the provider", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await handleTranslationRequest(
      request({ text: "hello", source: "en" }, { origin: "https://attacker.test" }),
    );

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      error: "Перевод доступен только из приложения SpeakUp.",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects requests without an Origin header before contacting the provider", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await handleTranslationRequest(
      request({ text: "hello", source: "en" }, { origin: null }),
    );

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      error: "Перевод доступен только из приложения SpeakUp.",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("validates JSON, text, source, and content type", async () => {
    vi.stubGlobal("fetch", vi.fn());

    const invalidJson = await handleTranslationRequest(request("{", { raw: true }));
    const empty = await handleTranslationRequest(request({ text: "   ", source: "ru" }));
    const invalidSource = await handleTranslationRequest(request({ text: "hello", source: "de" }));
    const wrongType = await handleTranslationRequest(
      request({ text: "hello", source: "en" }, { contentType: "text/plain" }),
    );

    expect(invalidJson.status).toBe(400);
    expect(empty.status).toBe(400);
    expect(invalidSource.status).toBe(400);
    expect(wrongType.status).toBe(415);
  });

  it("enforces the 500 UTF-8 byte text limit", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        providerResponse({ responseStatus: 200, responseData: { translatedText: "ok" } }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const accepted = await handleTranslationRequest(
      request({ text: "я".repeat(250), source: "ru" }),
    );
    const rejected = await handleTranslationRequest(
      request({ text: "я".repeat(251), source: "ru" }),
    );

    expect(accepted.status).toBe(200);
    expect(rejected.status).toBe(413);
    expect(await rejected.json()).toEqual({
      error: "Текст слишком длинный. Максимум — 500 байт UTF-8.",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("stops reading request bodies after the actual 4 KB limit", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const oversized = `{"text":"${"x".repeat(MAX_TRANSLATION_BODY_BYTES)}","source":"en"}`;

    const response = await handleTranslationRequest(request(oversized, { raw: true }));

    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps provider quota responses to a safe error instead of translation text", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        providerResponse({
          responseStatus: 403,
          responseData: { translatedText: "PLEASE USE A VALID EMAIL" },
        }),
      )
      .mockResolvedValueOnce(
        providerResponse({
          responseStatus: 200,
          quotaFinished: "true",
          responseData: { translatedText: "QUOTA FINISHED" },
        }),
      )
      .mockResolvedValueOnce(providerResponse({ responseStatus: 403 }, 403));
    vi.stubGlobal("fetch", fetchMock);

    for (let index = 0; index < 3; index++) {
      const response = await handleTranslationRequest(request({ text: "hello", source: "en" }));
      expect(response.status).toBe(429);
      const body = await response.json();
      expect(body).toEqual({ error: "Лимит переводов на сегодня исчерпан. Попробуйте позже." });
      expect(JSON.stringify(body)).not.toMatch(/quota|valid email/i);
    }
  });

  it("hides malformed and failed provider responses behind useful errors", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(providerResponse({ responseStatus: 200, responseData: {} }))
      .mockResolvedValueOnce(
        providerResponse({ responseStatus: 500, responseDetails: "sensitive provider detail" }),
      )
      .mockRejectedValueOnce(new Error("private network failure"));
    vi.stubGlobal("fetch", fetchMock);

    const missing = await handleTranslationRequest(request({ text: "hello", source: "en" }));
    const failed = await handleTranslationRequest(request({ text: "hello", source: "en" }));
    const network = await handleTranslationRequest(request({ text: "hello", source: "en" }));

    expect(missing.status).toBe(502);
    expect(failed.status).toBe(502);
    expect(network.status).toBe(502);
    expect(await failed.text()).not.toContain("sensitive provider detail");
    expect(await network.text()).not.toContain("private network failure");
  });

  it("aborts the provider after eight seconds and reports a timeout", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(
      (_url: URL, init: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init.signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const pending = handleTranslationRequest(request({ text: "hello", source: "en" }));
    await vi.advanceTimersByTimeAsync(TRANSLATION_TIMEOUT_MS);
    const response = await pending;

    expect(response.status).toBe(504);
    expect(await response.json()).toEqual({ error: "Сервис перевода не ответил вовремя." });
    expect((fetchMock.mock.calls[0]?.[1] as RequestInit).signal?.aborted).toBe(true);
  });

  it("propagates request cancellation to the provider", async () => {
    const providerSignal: { current: AbortSignal | undefined } = { current: undefined };
    const fetchMock = vi.fn((_url: URL, init: RequestInit) => {
      providerSignal.current = init.signal ?? undefined;
      return new Promise<Response>((_resolve, reject) => {
        init.signal?.addEventListener("abort", () =>
          reject(new DOMException("Aborted", "AbortError")),
        );
      });
    });
    vi.stubGlobal("fetch", fetchMock);
    const controller = new AbortController();
    const pending = handleTranslationRequest(
      request({ text: "hello", source: "en" }, { signal: controller.signal }),
    );
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());

    controller.abort();
    const response = await pending;

    expect(providerSignal.current?.aborted).toBe(true);
    expect(response.status).toBe(499);
    expect(await response.json()).toEqual({ error: "Запрос на перевод отменён." });
  });
});
