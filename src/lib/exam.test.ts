import { expect, it } from "vitest";
import { createExam } from "./exam";
import { wordPool } from "./learning";

it("only asks about studied words with one correct option", () => {
  const words = wordPool.slice(0, 6);
  const questions = createExam(words, true);
  expect(questions).toHaveLength(6);
  expect(new Set(questions.map((q) => q.area)).size).toBe(3);
  for (const question of questions) {
    expect(words.some((w) => w.id === question.wordId)).toBe(true);
    expect(question.options.filter((option) => option === question.answer)).toHaveLength(1);
    expect(new Set(question.options).size).toBe(4);
  }
});
it("supports empty and non-audio sessions", () => {
  expect(createExam([], true)).toEqual([]);
  expect(createExam(wordPool, false).some((q) => q.audio || q.area === "Listening")).toBe(false);
  expect(createExam(wordPool, true)).toHaveLength(9);
});
