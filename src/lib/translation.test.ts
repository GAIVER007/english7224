import { afterEach, expect, it, vi } from "vitest";
import {
  detectTranslationLanguage,
  requestTranslation,
  translationInputError,
} from "./translation";
afterEach(() => vi.unstubAllGlobals());
it("detects Russian/English including mixed text and ё", () => {
  expect(detectTranslationLanguage("Hello there")).toBe("en");
  expect(detectTranslationLanguage("Привет, John!")).toBe("ru");
  expect(detectTranslationLanguage("ёж")).toBe("ru");
  expect(translationInputError(" ")).toBeNull();
  expect(translationInputError("123")).not.toBeNull();
  expect(translationInputError("я".repeat(241))).not.toBeNull();
});
it("validates server responses and uses a POST without putting text in URL", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(Response.json({ translation: "Hello", source: "ru", target: "en" }))
    .mockResolvedValueOnce(Response.json({ translation: "stale", source: "en", target: "ru" }));
  vi.stubGlobal("fetch", fetcher);
  const signal = new AbortController().signal;
  expect(await requestTranslation("Привет", "ru", signal)).toMatchObject({ translation: "Hello" });
  expect(fetcher).toHaveBeenCalledWith(
    "/api/translate",
    expect.objectContaining({
      method: "POST",
      signal,
      body: JSON.stringify({ text: "Привет", source: "ru" }),
    }),
  );
  await expect(requestTranslation("Привет", "ru", signal)).rejects.toThrow();
});

it("localizes Safari transport failures without exposing browser error text", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Load failed")));
  await expect(requestTranslation("Hello", "en", new AbortController().signal)).rejects.toThrow(
    "Нет связи с переводчиком",
  );
});
