import { expect, it } from "vitest";
import {
  grammarReview,
  grammarTopicProgress,
  grammarTheory,
  reviewGrammar,
} from "./grammar-review";
import { grammarTasks } from "./free-trainer";
import { createInitialState } from "./store";
import { createBackup, parseBackup } from "./backup";

const task = grammarTasks()[0]!;
it("keeps failures across backup restore and schedules successful recall later", () => {
  const card = reviewGrammar(undefined, false, 100);
  const state = { ...createInitialState(), grammarCards: { [task.id]: card } };
  const restored = parseBackup(createBackup(state)).state;
  expect(grammarReview(restored.grammarCards!, 100).map((t) => t.id)).toEqual([task.id]);
  const success = reviewGrammar(card, true, 200);
  expect(grammarReview({ [task.id]: success }, 201)).toEqual([]);
  expect(grammarReview({ [task.id]: success }, success.due)).toHaveLength(1);
});
it("does not inflate reinforced progress by answering the same phrase immediately", () => {
  const first = reviewGrammar(undefined, true, 100);
  const repeat = reviewGrammar(first, true, 200);
  expect(repeat.box).toBe(1);
  expect(repeat.due).toBe(first.due);
  const delayed = reviewGrammar(repeat, true, repeat.due);
  expect(delayed.box).toBe(2);
  expect(grammarTopicProgress({ [task.id]: delayed }, task.tense, task.form)).toEqual({
    total: 24,
    practiced: 1,
    reinforced: 1,
  });
});
it("limits review to ten known due phrases and ignores obsolete ids", () => {
  const cards = Object.fromEntries(
    grammarTasks()
      .slice(0, 15)
      .map((t) => [t.id, reviewGrammar(undefined, false, 0)]),
  );
  cards["obsolete"] = reviewGrammar(undefined, false, 0);
  expect(grammarReview(cards, 0)).toHaveLength(10);
  expect(grammarReview(cards, 0).every((t) => t.id !== "obsolete")).toBe(true);
});
it("provides original rules for all nine topics", () => {
  for (const tense of ["present", "past", "future"])
    for (const form of ["positive", "negative", "question"]) {
      expect(grammarTheory(tense, form).length).toBeGreaterThan(60);
    }
});
