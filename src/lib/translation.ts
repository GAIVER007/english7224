export type TranslationLanguage = "ru" | "en";
export type TranslationMode = "auto" | TranslationLanguage;
export interface TranslationResult {
  translation: string;
  source: TranslationLanguage;
  target: TranslationLanguage;
  provider: "OPUS-MT";
}
export const TRANSLATION_MAX_CHARS = 5000;
export function detectTranslationLanguage(text: string): TranslationLanguage {
  const russian = (text.match(/[а-яё]/gi) ?? []).length;
  const english = (text.match(/[a-z]/gi) ?? []).length;
  return russian > 0 && russian >= english ? "ru" : "en";
}
export function oppositeLanguage(source: TranslationLanguage): TranslationLanguage {
  return source === "ru" ? "en" : "ru";
}
export function translationInputError(text: string): string | null {
  if (text.length > TRANSLATION_MAX_CHARS)
    return "Раздели текст на части до 5 000 символов. Суточного ограничения нет.";
  if (text.trim() && !/[а-яёa-z]/i.test(text))
    return "Напиши слово или фразу на русском или английском.";
  return null;
}
export async function requestTranslation(
  text: string,
  source: TranslationLanguage,
  signal: AbortSignal,
): Promise<TranslationResult> {
  const validationError = translationInputError(text);
  if (validationError) throw new Error(validationError);
  if (!text.trim()) throw new Error("Напиши текст для перевода.");
  const { translateOffline } = await import("./offline-translator");
  const translation = await translateOffline(text.trim(), source, signal);
  return { translation, source, target: oppositeLanguage(source), provider: "OPUS-MT" };
}
