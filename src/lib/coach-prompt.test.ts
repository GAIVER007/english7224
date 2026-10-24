import { expect, it } from "vitest";
import { coachPrompt } from "./coach-prompt";
import { lessons } from "./content";
import { createInitialState } from "./store";

it("creates honest minimal context without activity or raw state", () => {
  const state = createInitialState();
  state.lastActive = "2026-10-24";
  state.xp = 987654;
  const prompt = coachPrompt(state, "conversation");
  expect(prompt).toContain("одну короткую реплику");
  expect(prompt).toContain("ещё не определён");
  expect(prompt).not.toContain(state.lastActive);
  expect(prompt).not.toContain("987654");
  expect(prompt).toContain("Не оценивай произношение");
});
it("includes known weak words and recent grammar evidence", () => {
  const state = createInitialState();
  const word = lessons[0]!.words[0]!;
  state.cards[word.id] = { box: 0, due: 0, correct: 0, wrong: 2 };
  state.grammarHistory = [true, false, true];
  const prompt = coachPrompt(state, "mistakes");
  expect(prompt).toContain(word.en);
  expect(prompt).toContain("2 верных ответов из последних 3");
  expect(prompt).toContain("Не выдумывай мои прошлые ошибки");
});
it("supports post-course practice", () => {
  expect(coachPrompt({ ...createInitialState(), day: 31 }, "practice")).toContain("30 из 30");
});
