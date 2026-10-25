export type OfflineTranslationLanguage = "ru" | "en";

export type OfflineTranslatorErrorCode =
  | "unavailable"
  | "not-installed"
  | "download-failed"
  | "translation-failed"
  | "input-too-long"
  | "superseded"
  | "aborted";

export class OfflineTranslatorError extends Error {
  constructor(
    public readonly code: OfflineTranslatorErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "OfflineTranslatorError";
  }
}

export interface OfflineModelProgress {
  phase: "checking" | "downloading" | "ready";
  source: OfflineTranslationLanguage;
  progress: number;
  file?: string;
}

export interface TranslationTextChunk {
  text: string;
  separator: string;
}

export interface OfflineModelIdentity {
  id: string;
  revision: string;
}

const DEFAULT_CHUNK_LENGTH = 300;

function splitOversizedPart(part: string, maxLength: number): string[] {
  const words = part.trim().split(/\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const word of words) {
    if (word.length > maxLength) {
      throw new OfflineTranslatorError(
        "input-too-long",
        "Слишком длинное слово или ссылка. Раздели этот фрагмент пробелами и повтори перевод.",
      );
    }
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLength) current = candidate;
    else {
      chunks.push(current);
      current = word;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function splitParagraph(paragraph: string, maxLength: number): string[] {
  const sentences = paragraph.match(/[^.!?…]+[.!?…]+(?:["'»”)]*)|[^.!?…]+$/g) ?? [paragraph];
  const chunks: string[] = [];
  for (const rawSentence of sentences) {
    const sentence = rawSentence.trim();
    if (!sentence) continue;
    chunks.push(
      ...(sentence.length <= maxLength ? [sentence] : splitOversizedPart(sentence, maxLength)),
    );
  }
  return chunks;
}

/** Splits prose into conservative Marian-sized chunks while retaining paragraph breaks. */
export function chunkTranslationText(
  text: string,
  maxLength = DEFAULT_CHUNK_LENGTH,
): TranslationTextChunk[] {
  if (!Number.isInteger(maxLength) || maxLength < 20) {
    throw new Error("Размер фрагмента перевода должен быть не меньше 20 символов.");
  }
  const chunks: TranslationTextChunk[] = [];
  const parts = text.trim().split(/(\n+)/);
  for (const part of parts) {
    if (!part) continue;
    if (/^\n+$/.test(part)) {
      const previous = chunks.at(-1);
      if (previous) previous.separator += part;
      continue;
    }
    for (const paragraphChunk of splitParagraph(part, maxLength)) {
      const previous = chunks.at(-1);
      if (previous && !previous.separator.endsWith("\n")) previous.separator = " ";
      chunks.push({ text: paragraphChunk, separator: "" });
    }
  }
  return chunks;
}

export function isCompletePinnedModelManifest(
  files: string[],
  model: OfflineModelIdentity,
): boolean {
  const requiredFiles = new Set([
    "config.json",
    "tokenizer.json",
    "tokenizer_config.json",
    "onnx/encoder_model_quantized.onnx",
    "onnx/decoder_model_merged_quantized.onnx",
  ]);
  const revisionPrefix = `/${model.id}/resolve/${model.revision}/`;
  const belongsToPinnedRevision = files.every((file) => {
    try {
      const url = new URL(file);
      return url.origin === "https://huggingface.co" && url.pathname.startsWith(revisionPrefix);
    } catch {
      return false;
    }
  });
  const relativeFiles = files.map((file) => {
    try {
      return new URL(file).pathname.slice(revisionPrefix.length);
    } catch {
      return "";
    }
  });
  return (
    files.length === new Set(files).size &&
    belongsToPinnedRevision &&
    [...requiredFiles].every((file) => relativeFiles.includes(file))
  );
}

export type OfflineWorkerRequest =
  | { type: "install"; id: number }
  | { type: "status"; id: number }
  | { type: "translate"; id: number; text: string; source: OfflineTranslationLanguage }
  | { type: "cancel"; id: number };

export type OfflineWorkerResponse =
  | { type: "progress"; id: number; progress: OfflineModelProgress }
  | { type: "result"; id: number; value: string | boolean | null }
  | { type: "error"; id: number; code: OfflineTranslatorErrorCode; message: string };
