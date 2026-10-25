import type { PathUnit } from "./types";
import { wordCount } from "./progress";

export type WritingHintKind =
  "cyrillic" | "mixed-script" | "lowercase-i" | "repeated-word" | "agreement";

export interface WritingHint {
  kind: WritingHintKind;
  message: string;
}

export interface WritingFeedbackReport {
  statistics: {
    words: number;
    sentences: number;
    characters: number;
  };
  minimum: {
    required: number;
    met: boolean;
    missing: number;
  };
  copiedModel: boolean;
  hints: WritingHint[];
}

const MAX_HINTS = 4;
const ALLOWED_REPETITIONS = new Set(["had", "that"]);

function wordsIn(text: string) {
  return text.trim().match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? [];
}

function sentenceCount(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.match(/[.!?]+(?=\s|$)/g)?.length ?? 1;
}

function normalizeForComparison(text: string) {
  return text
    .normalize("NFKC")
    .toLocaleLowerCase("en-US")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function withoutQuotedExamples(text: string) {
  return text.replace(/"[^"\n]*"|“[^”\n]*”|‘[^’\n]*’/gu, " ");
}

function repeatedWords(text: string) {
  const repeated = new Set<string>();
  for (const match of text.matchAll(/\b([A-Za-z]+)\s+\1\b/gi)) {
    const word = match[1]!.toLocaleLowerCase("en-US");
    if (!ALLOWED_REPETITIONS.has(word)) repeated.add(word);
  }
  return [...repeated].slice(0, 2);
}

export function analyzeWriting(text: string, unit: PathUnit): WritingFeedbackReport {
  // Keep this count identical to the pathway completion gate.
  const words = wordCount(text);
  const required = unit.writing.minWords;
  const unquoted = withoutQuotedExamples(text);
  const hints: WritingHint[] = [];

  const mixedScriptWord = wordsIn(unquoted).find(
    (word) => /[A-Za-z]/.test(word) && /\p{Script=Cyrillic}/u.test(word),
  );
  if (mixedScriptWord) {
    hints.push({
      kind: "mixed-script",
      message: `Проверь слово «${mixedScriptWord}»: в нём смешаны латинские и кириллические буквы.`,
    });
  } else if (/\p{Script=Cyrillic}/u.test(unquoted)) {
    hints.push({
      kind: "cyrillic",
      message:
        "В тексте есть кириллица. Если это не имя или пояснение, замени её английскими словами.",
    });
  }

  if (/(^|[^A-Za-z])i(?=$|[^A-Za-z])/.test(unquoted)) {
    hints.push({
      kind: "lowercase-i",
      message: "Английское местоимение I пишется с заглавной буквы.",
    });
  }

  const repeats = repeatedWords(unquoted);
  if (repeats.length > 0) {
    hints.push({
      kind: "repeated-word",
      message: `Проверь случайный повтор: ${repeats.map((word) => `«${word} ${word}»`).join(", ")}.`,
    });
  }

  const agreementExamples: string[] = [];
  if (/(?:^|[.!?]\s+)I\s+is\b/.test(unquoted)) agreementExamples.push("I is → I am");
  if (/\b(?:he|she|it)\s+are\b/i.test(unquoted))
    agreementExamples.push("he/she/it are → he/she/it is");
  if (agreementExamples.length > 0) {
    hints.push({
      kind: "agreement",
      message: `Проверь согласование: ${agreementExamples.join("; ")}.`,
    });
  }

  const normalizedText = normalizeForComparison(text);
  const normalizedModel = normalizeForComparison(unit.writing.model);

  return {
    statistics: {
      words,
      sentences: sentenceCount(text),
      characters: text.length,
    },
    minimum: {
      required,
      met: words >= required,
      missing: Math.max(0, required - words),
    },
    copiedModel:
      normalizedText.length > 0 && normalizedModel.length > 0 && normalizedText === normalizedModel,
    hints: hints.slice(0, MAX_HINTS),
  };
}
