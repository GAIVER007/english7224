import { describe, expect, it } from "vitest";
import {
  currentStreak,
  canOpenStep,
  completeStep,
  dueWords,
  levelFromScore,
  studiedWords,
  wordPool,
} from "./learning";
import { STEPS, type AppState } from "./store";
import { lessons } from "./content";

const fresh = (): AppState => ({
  level: "A2",
  day: 1,
  xp: 0,
  streak: 0,
  lastActive: null,
  steps: {},
  cards: {},
  weakAreas: {},
});

describe("lesson progression", () => {
  it("rejects skipping to the final test", () => {
    const state = fresh();
    expect(canOpenStep(state, 1, "test")).toBe(false);
    expect(completeStep(state, 1, "test")).toBe(state);
  });
  it("awards each completed step once and advances only after every step", () => {
    let state = fresh();
    for (const step of STEPS) {
      const next = completeStep(state, 1, step);
      expect(next.xp).toBe(state.xp + 10);
      expect(completeStep(next, 1, step)).toBe(next);
      if (step !== "test") expect(next.day).toBe(1);
      state = next;
    }
    expect(state.day).toBe(2);
    expect(state.xp).toBe(60);
  });
  it("ends the finite course without granting fictional lessons", () => {
    let state = fresh();
    for (const lesson of lessons)
      for (const step of STEPS) state = completeStep(state, lesson.day, step);
    expect(state.day).toBe(lessons.length + 1);
    expect(completeStep(state, state.day, "review")).toBe(state);
  });
  it("rejects stale completions from another lesson", () => {
    const state = { ...fresh(), day: 2 };
    expect(completeStep(state, 1, "review")).toBe(state);
  });
});

describe("review and placement", () => {
  it("reviews only studied cards which are due, including mistakes immediately", () => {
    const state = fresh();
    state.cards[wordPool[0]!.id] = { box: 0, due: 5, correct: 0, wrong: 1 };
    state.cards[wordPool[1]!.id] = { box: 1, due: 100, correct: 1, wrong: 0 };
    expect(dueWords(state, 10).map((w) => w.id)).toEqual([wordPool[0]!.id]);
    expect(studiedWords(state)).toHaveLength(2);
    expect(dueWords(fresh())).toEqual([]);
  });
  it("does not jump levels after failing prerequisite levels", () => {
    expect(levelFromScore([])).toBe("A1");
    expect(levelFromScore(["C1"])).toBe("A1");
    expect(levelFromScore(["A1", "A2", "B1"])).toBe("B1");
  });
  it("checks content invariants", () => {
    expect(new Set(wordPool.map((w) => w.id)).size).toBe(wordPool.length);
    for (const [index, lesson] of lessons.entries()) {
      expect(lesson.day).toBe(index + 1);
      expect(lesson.words.length).toBeGreaterThanOrEqual(4);
      expect(lesson.speaking.length).toBeGreaterThan(0);
      expect(lesson.dialogue.length).toBeGreaterThan(0);
    }
  });
});

it("shows an expired streak as zero without altering historical activity", () => {
  const state = { ...fresh(), streak: 4, lastActive: new Date(2026, 9, 20).toDateString() };
  expect(currentStreak(state, new Date(2026, 9, 21))).toBe(4);
  expect(currentStreak(state, new Date(2026, 9, 22))).toBe(0);
  expect(state.streak).toBe(4);
});
