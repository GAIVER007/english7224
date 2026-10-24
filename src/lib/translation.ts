export type TranslationLanguage = "ru" | "en";
export type TranslationMode = "auto" | TranslationLanguage;
export interface TranslationResult {
  translation: string;
  source: TranslationLanguage;
  target: TranslationLanguage;
  provider: "MyMemory";
}
export const TRANSLATION_MAX_CHARS = 240;
export function detectTranslationLanguage(text: string): TranslationLanguage {
  const russian = (text.match(/[а-яё]/gi) ?? []).length;
  const english = (text.match(/[a-z]/gi) ?? []).length;
  return russian > 0 && russian >= english ? "ru" : "en";
}
export function oppositeLanguage(source: TranslationLanguage): TranslationLanguage {
  return source === "ru" ? "en" : "ru";
}
export function translationInputError(text: string): string | null {
  if (text.length > TRANSLATION_MAX_CHARS || new TextEncoder().encode(text).byteLength > 500)
    return "Сократи текст: переводчик рассчитан на короткие фразы до 240 символов.";
  if (text.trim() && !/[а-яёa-z]/i.test(text))
    return "Напиши слово или фразу на русском или английском.";
  return null;
}
export async function requestTranslation(
  text: string,
  source: TranslationLanguage,
  signal: AbortSignal,
): Promise<TranslationResult> {
  let response: Response;
  try {
    response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, source }),
      signal,
    });
  } catch (failure) {
    if (signal.aborted) throw failure;
    throw new Error("Нет связи с переводчиком. Проверь интернет и попробуй снова.");
  }
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error("Не удалось получить перевод. Попробуй ещё раз.");
  }
  if (!data || typeof data !== "object")
    throw new Error("Сервис вернул непонятный ответ. Попробуй ещё раз.");
  const value = data as Record<string, unknown>;
  if (!response.ok)
    throw new Error(
      typeof value["error"] === "string" ? value["error"] : "Перевод временно недоступен.",
    );
  if (
    typeof value["translation"] !== "string" ||
    !value["translation"].trim() ||
    value["source"] !== source ||
    value["target"] !== oppositeLanguage(source)
  )
    throw new Error("Не удалось получить перевод. Попробуй ещё раз.");
  return {
    translation: value["translation"],
    source,
    target: oppositeLanguage(source),
    provider: "MyMemory",
  };
}
