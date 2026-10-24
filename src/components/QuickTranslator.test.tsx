import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { QuickTranslator } from "./QuickTranslator";
import { requestTranslation, type TranslationResult } from "@/lib/translation";
vi.mock("@/lib/translation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/translation")>()),
  requestTranslation: vi.fn(),
}));
vi.mock("@/lib/store", () => ({ speak: vi.fn() }));
const translated = (translation: string, source: "ru" | "en" = "ru"): TranslationResult => ({
  translation,
  source,
  target: source === "ru" ? "en" : "ru",
  provider: "MyMemory",
});
beforeEach(() => {
  vi.useFakeTimers();
  vi.mocked(requestTranslation).mockReset();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
function type(text: string) {
  fireEvent.change(screen.getByRole("textbox"), { target: { value: text } });
}
async function settle(ms = 650) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}
it("debounces input, detects Russian and reuses successful translations", async () => {
  vi.mocked(requestTranslation).mockResolvedValue(translated("Hello"));
  render(<QuickTranslator />);
  type("При");
  await settle(300);
  type("Привет");
  await settle(649);
  expect(requestTranslation).not.toHaveBeenCalled();
  await settle(1);
  expect(requestTranslation).toHaveBeenCalledWith("Привет", "ru", expect.any(AbortSignal));
  expect(screen.getByText("Hello")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Очистить текст" }));
  expect(screen.queryByText("Hello")).not.toBeInTheDocument();
  type("Привет");
  await settle();
  expect(requestTranslation).toHaveBeenCalledTimes(1);
});
it("aborts old requests and never displays a late stale response", async () => {
  let resolveOld!: (value: TranslationResult) => void;
  vi.mocked(requestTranslation)
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveOld = resolve;
        }),
    )
    .mockResolvedValueOnce(translated("Goodbye"));
  render(<QuickTranslator />);
  type("Привет");
  await settle();
  const oldSignal = vi.mocked(requestTranslation).mock.calls[0]![2];
  type("Пока");
  expect(oldSignal.aborted).toBe(true);
  await settle();
  await act(async () => {
    resolveOld(translated("Hello"));
  });
  expect(screen.getByText("Goodbye")).toBeInTheDocument();
  expect(screen.queryByText("Hello")).not.toBeInTheDocument();
});
it("supports manual direction and swaps the actual translated text", async () => {
  vi.mocked(requestTranslation)
    .mockResolvedValueOnce(translated("Привет", "en"))
    .mockResolvedValueOnce(translated("Hello"));
  render(<QuickTranslator />);
  type("Hello");
  await settle();
  fireEvent.click(screen.getByRole("button", { name: "Поменять языки местами" }));
  await settle();
  expect(screen.getByRole("textbox")).toHaveValue("Привет");
  expect(screen.getByLabelText("С какого языка")).toHaveValue("ru");
  expect(requestTranslation).toHaveBeenLastCalledWith("Привет", "ru", expect.any(AbortSignal));
});
it("shows provider failures, retries explicitly, and rejects non-language input", async () => {
  vi.mocked(requestTranslation)
    .mockRejectedValueOnce(new Error("Лимит исчерпан"))
    .mockResolvedValueOnce(translated("Hello"));
  render(<QuickTranslator />);
  type("Привет");
  await settle();
  expect(screen.getByRole("alert")).toHaveTextContent("Лимит исчерпан");
  fireEvent.click(screen.getByRole("button", { name: "Попробовать снова" }));
  await settle();
  expect(screen.getByText("Hello")).toBeInTheDocument();
  type("123 😊");
  await settle();
  expect(requestTranslation).toHaveBeenCalledTimes(2);
});
it("does not request translations during composition or after clearing", async () => {
  vi.mocked(requestTranslation).mockResolvedValue(translated("Hello"));
  render(<QuickTranslator />);
  fireEvent.compositionStart(screen.getByRole("textbox"));
  type("Привет");
  await settle();
  expect(requestTranslation).not.toHaveBeenCalled();
  fireEvent.compositionEnd(screen.getByRole("textbox"));
  fireEvent.click(screen.getByRole("button", { name: "Очистить текст" }));
  await settle();
  expect(requestTranslation).not.toHaveBeenCalled();
});
