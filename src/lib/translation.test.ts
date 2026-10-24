import { afterEach, expect, it, vi } from "vitest";
import {
  detectTranslationLanguage,
  requestTranslation,
  translationInputError,
} from "./translation";
import { translateOffline } from "./offline-translator";
vi.mock("./offline-translator", () => ({ translateOffline: vi.fn() }));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});
it("detects Russian/English and removes provider daily/byte limits", () => {
  expect(detectTranslationLanguage("Hello there")).toBe("en");
  expect(detectTranslationLanguage("Привет, John!")).toBe("ru");
  expect(detectTranslationLanguage("ёж")).toBe("ru");
  expect(translationInputError(" ")).toBeNull();
  expect(translationInputError("123")).not.toBeNull();
  expect(translationInputError("я".repeat(1000))).toBeNull();
  expect(translationInputError("я".repeat(5001))).not.toBeNull();
});
it("translates locally without invoking a network translation endpoint", async () => {
  const fetcher = vi.fn();
  vi.stubGlobal("fetch", fetcher);
  vi.mocked(translateOffline).mockResolvedValue("Hello");
  const signal = new AbortController().signal;
  expect(await requestTranslation("Привет", "ru", signal)).toEqual({
    translation: "Hello",
    source: "ru",
    target: "en",
    provider: "OPUS-MT",
  });
  expect(translateOffline).toHaveBeenCalledWith("Привет", "ru", signal);
  expect(fetcher).not.toHaveBeenCalled();
});
it("refuses empty or too-large input before starting inference", async () => {
  await expect(requestTranslation(" ", "en", new AbortController().signal)).rejects.toThrow();
  await expect(
    requestTranslation("a".repeat(5001), "en", new AbortController().signal),
  ).rejects.toThrow();
  expect(translateOffline).not.toHaveBeenCalled();
});
