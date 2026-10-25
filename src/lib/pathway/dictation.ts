import { normalizeSpeechText } from "../speech";

const words = (text: string) => normalizeSpeechText(text).split(" ").filter(Boolean);

/** Whole sentences only: never cut the learner's target halfway through a phrase. */
export function dictationPhrases(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => {
      const length = words(s).length;
      return length >= 3 && length <= 24;
    })
    .slice(0, 3);
}

export type WordDifference = { expected: string; actual: string };
export function checkDictation(target: string, answer: string) {
  const expected = words(target);
  const actual = words(answer);
  const costs = Array.from({ length: expected.length + 1 }, (_, i) =>
    Array.from({ length: actual.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= expected.length; i++) {
    for (let j = 1; j <= actual.length; j++) {
      costs[i]![j] = Math.min(
        costs[i - 1]![j]! + 1,
        costs[i]![j - 1]! + 1,
        costs[i - 1]![j - 1]! + (expected[i - 1] === actual[j - 1] ? 0 : 1),
      );
    }
  }
  const differences: WordDifference[] = [];
  let i = expected.length;
  let j = actual.length;
  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      costs[i]![j] === costs[i - 1]![j - 1]! + (expected[i - 1] === actual[j - 1] ? 0 : 1)
    ) {
      if (expected[i - 1] !== actual[j - 1])
        differences.push({ expected: expected[i - 1]!, actual: actual[j - 1]! });
      i--;
      j--;
    } else if (i > 0 && costs[i]![j] === costs[i - 1]![j]! + 1) {
      differences.push({ expected: expected[i - 1]!, actual: "" });
      i--;
    } else {
      differences.push({ expected: "", actual: actual[j - 1]! });
      j--;
    }
  }
  return {
    correct: expected.length > 0 && differences.length === 0,
    differences: differences.reverse(),
  };
}
