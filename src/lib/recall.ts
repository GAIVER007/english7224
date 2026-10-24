const CURLY_APOSTROPHES = /[\u2018\u2019\u02bc\u0060\u00b4]/g;
const DASHES = /[\u2010-\u2015-]/g;
const IGNORED_PUNCTUATION = /(?:[.,!?;:(){}"\u00ab\u00bb\u2026]|\[|\])/g;

export function normalizeRecallAnswer(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("en-US")
    .replace(CURLY_APOSTROPHES, "'")
    .replace(DASHES, " ")
    .replace(IGNORED_PUNCTUATION, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function isRecallAnswerCorrect(answer: string, expected: string): boolean {
  const normalizedAnswer = normalizeRecallAnswer(answer);
  return normalizedAnswer.length > 0 && normalizedAnswer === normalizeRecallAnswer(expected);
}
