import { describe, expect, it } from "vitest";
import {
  currentStreak,
  canOpenStep,
  completeStep,
  dueWords,
  finishLessonExam,
  finishModuleExam,
  levelFromScore,
  studiedWords,
  wordPool,
} from "./learning";
import { STEPS, type AppState } from "./store";
import { lessons } from "./content";
import { moduleExamKey, pendingModule } from "./curriculum";

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
  it("requires the mini-exam, saves a failed attempt and advances at 80%", () => {
    let state = fresh();
    for (const step of STEPS.slice(0, -1)) {
      const next = completeStep(state, 1, step);
      expect(next.xp).toBe(state.xp + 10);
      expect(completeStep(next, 1, step)).toBe(next);
      expect(next.day).toBe(1);
      state = next;
    }
    expect(completeStep(state, 1, "test")).toBe(state);

    state = finishLessonExam(state, 1, { correct: 5, total: 7 });
    expect(state.examResults?.["lesson:1"]).toMatchObject({ correct: 5, passed: false });
    expect(state.day).toBe(1);
    expect(state.xp).toBe(50);

    state = finishLessonExam(state, 1, { correct: 6, total: 7 });
    expect(state.day).toBe(2);
    expect(state.xp).toBe(60);
    expect(state.steps["1:test"]).toBe(true);
  });
  it("gates each completed module and ends the finite course after its final exam", () => {
    let state = fresh();
    for (const lesson of lessons) {
      for (const step of STEPS.slice(0, -1)) state = completeStep(state, lesson.day, step);
      state = finishLessonExam(state, lesson.day, { correct: 7, total: 7 });
      const pending = pendingModule(state);
      if (pending) {
        expect(canOpenStep(state, state.day, "review")).toBe(false);
        state = finishModuleExam(state, pending.id, { correct: 12, total: 15 });
      }
    }
    expect(state.day).toBe(lessons.length + 1);
    expect(pendingModule(state)).toBeUndefined();
    expect(completeStep(state, state.day, "review")).toBe(state);
  });
  it("rejects stale completions from another lesson", () => {
    const state = { ...fresh(), day: 2 };
    expect(completeStep(state, 1, "review")).toBe(state);
  });
});

describe("module exams", () => {
  it("keeps an old ten-lesson learner's progress and requests missed module exams in order", () => {
    let state = { ...fresh(), day: 11, xp: 600 };
    expect(pendingModule(state)?.id).toBe(1);
    expect(finishModuleExam(state, 2, { correct: 15, total: 15 })).toBe(state);

    state = finishModuleExam(state, 1, { correct: 12, total: 15 });
    expect(state.day).toBe(11);
    expect(state.xp).toBe(630);
    expect(pendingModule(state)?.id).toBe(2);
  });

  it("saves failures, awards 30 XP once and never revokes a passed retake", () => {
    let state = { ...fresh(), day: 6, xp: 100 };
    state = finishModuleExam(state, 1, { correct: 11, total: 15 });
    expect(state.examResults?.[moduleExamKey(1)]?.passed).toBe(false);
    expect(state.xp).toBe(100);

    state = finishModuleExam(state, 1, { correct: 12, total: 15 });
    expect(state.examResults?.[moduleExamKey(1)]?.passed).toBe(true);
    expect(state.xp).toBe(130);
    expect(state.streak).toBe(1);
    expect(Object.values(state.activity ?? {})).toEqual([1]);

    const passed = state;
    state = finishModuleExam(state, 1, { correct: 10, total: 15 });
    expect(state.xp).toBe(passed.xp);
    expect(state.examResults).toEqual(passed.examResults);
    expect(state.resultHistory).toHaveLength(3);
    state = finishModuleExam(state, 1, { correct: 15, total: 15 });
    expect(state.xp).toBe(130);
  });

  it("rejects malformed scores and unavailable module attempts", () => {
    const state = { ...fresh(), day: 6 };
    expect(finishModuleExam(state, 1, { correct: 12, total: 14 })).toBe(state);
    expect(finishModuleExam(state, 1, { correct: 16, total: 15 })).toBe(state);
    expect(finishModuleExam(state, 2, { correct: 15, total: 15 })).toBe(state);
    expect(finishLessonExam(state, 6, { correct: 6.5, total: 7 })).toBe(state);
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
