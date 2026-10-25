import { describe, expect, it } from "vitest";
import { createInitialState, type AppState } from "../store";
import { createBackup, parseBackup } from "../backup";
import { PATH_LEVELS, levelQuestions, pathUnits, unitsForLevel } from "./index";
import { emptyPath, emptyUnit, examBankVersion } from "./state";
import { submitLevel, startNextLevelAttempt } from "./progress";

function prepared(version: 1 | 2 | 3): AppState {
  const state = createInitialState();
  state.pathway = {
    ...emptyPath(),
    units: Object.fromEntries(
      unitsForLevel("A0").map((u) => [u.id, { ...emptyUnit(), passed: true, best: 6 }]),
    ),
    exams: {
      A0: {
        version,
        answers: Object.fromEntries(levelQuestions("A0", version).map((q) => [q.id, q.answer])),
        submitted: false,
        passed: false,
        best: 0,
        attempts: 0,
      },
    },
  };
  return state;
}

describe("independent level assessments", () => {
  it("provides original balanced questions with valid remediation and new passages", () => {
    const lessonPrompts = new Set(pathUnits.flatMap((u) => u.questions.map((q) => q.prompt)));
    const lessonPassages = new Set(pathUnits.flatMap((u) => [u.reading, u.listening]));
    const ids = new Set<string>();
    for (const level of PATH_LEVELS) {
      const questions = levelQuestions(level);
      expect(questions).toHaveLength(24);
      for (const skill of ["grammar", "reading", "listening"])
        expect(questions.filter((q) => q.skill === skill)).toHaveLength(8);
      for (const q of questions) {
        expect(ids.has(q.id), q.id).toBe(false);
        ids.add(q.id);
        expect(lessonPrompts.has(q.prompt), q.id).toBe(false);
        expect(q.options).toContain(q.answer);
        expect(new Set(q.options).size).toBe(q.options.length);
        expect(q.options.length).toBeGreaterThanOrEqual(3);
        expect(pathUnits.find((u) => u.id === q.unitId)?.level).toBe(level);
        expect(q.explanation.length).toBeGreaterThan(15);
        if (q.skill !== "grammar") {
          expect(q.passage?.length).toBeGreaterThan(30);
          expect(lessonPassages.has(q.passage!)).toBe(false);
        }
      }
    }
  });
  it("provides a distinct balanced second variant at every level", () => {
    const oldPrompts = new Set([
      ...pathUnits.flatMap((u) => u.questions.map((q) => q.prompt)),
      ...PATH_LEVELS.flatMap((level) => levelQuestions(level, 2).map((q) => q.prompt)),
    ]);
    const oldPassages = new Set([
      ...pathUnits.flatMap((u) => [u.reading, u.listening]),
      ...PATH_LEVELS.flatMap((level) => levelQuestions(level, 2).map((q) => q.passage)),
    ]);
    const ids = new Set(PATH_LEVELS.flatMap((level) => levelQuestions(level, 2).map((q) => q.id)));
    for (const level of PATH_LEVELS) {
      const questions = levelQuestions(level, 3);
      expect(questions).toHaveLength(24);
      for (const skill of ["grammar", "reading", "listening"])
        expect(questions.filter((q) => q.skill === skill)).toHaveLength(8);
      for (const q of questions) {
        expect(ids.has(q.id), q.id).toBe(false);
        ids.add(q.id);
        expect(oldPrompts.has(q.prompt), q.id).toBe(false);
        expect(q.options.filter((option) => option === q.answer)).toHaveLength(1);
        expect(new Set(q.options).size).toBe(q.options.length);
        expect(q.options.length).toBeGreaterThanOrEqual(3);
        expect(pathUnits.find((u) => u.id === q.unitId)?.level, q.id).toBe(level);
        expect(q.explanation.length).toBeGreaterThan(15);
        if (q.skill !== "grammar") {
          expect(q.passage?.length).toBeGreaterThan(30);
          expect(oldPassages.has(q.passage), q.id).toBe(false);
        }
      }
    }
  });

  it("pins partial variant answers through backup and rotates only after submission", () => {
    const state = prepared(3);
    const questions = levelQuestions("A0", 3);
    state.pathway!.exams.A0!.answers = { [questions[0]!.id]: questions[0]!.answer };
    expect(startNextLevelAttempt(state, "A0")).toBe(state);
    const restored = parseBackup(createBackup(state)).state;
    expect(examBankVersion(restored.pathway!.exams.A0)).toBe(3);
    expect(restored.pathway!.exams.A0!.answers).toEqual(state.pathway!.exams.A0!.answers);
  });

  it("alternates both variants without repeating XP or changing historical grades", () => {
    let state = submitLevel(prepared(2), "A0", 1000);
    expect(state.xp).toBe(50);
    state = startNextLevelAttempt(state, "A0");
    expect(state.pathway!.exams.A0).toMatchObject({
      version: 3,
      answers: {},
      best: 24,
      passed: true,
    });
    state.pathway!.exams.A0!.answers = Object.fromEntries(
      levelQuestions("A0", 3).map((q) => [q.id, q.answer]),
    );
    state = submitLevel(parseBackup(createBackup(state)).state, "A0", 2000);
    expect(state.xp).toBe(50);
    expect(state.pathway!.history.map((r) => [r.examVersion, r.correct])).toEqual([
      [2, 24],
      [3, 24],
    ]);
    const next = startNextLevelAttempt(state, "A0");
    expect(next.pathway!.exams.A0!.version).toBe(2);
    expect(next.pathway!.exams.A0!.attempts).toBe(2);
    expect(next.pathway!.history).toEqual(state.pathway!.history);
  });

  it("keeps old saved answers gradeable after the question bank changes", () => {
    const state = prepared(1);
    delete state.pathway!.exams.A0!.version;
    const restored = parseBackup(createBackup(state)).state;
    const result = submitLevel(restored, "A0", 1000);
    expect(result.pathway!.history[0]).toMatchObject({ correct: 24, examVersion: 1 });
    expect(result.xp).toBe(50);
  });
  it("persists remediation for wrong answers without repeating rewards", () => {
    const state = prepared(2);
    const question = levelQuestions("A0")[0]!;
    state.pathway!.exams.A0!.answers[question.id] = question.options.find(
      (o) => o !== question.answer,
    )!;
    const first = submitLevel(state, "A0", 1000);
    expect(first.pathway!.history[0]).toMatchObject({
      correct: 23,
      examVersion: 2,
      reviewUnitIds: [question.unitId],
    });
    expect(parseBackup(createBackup(first)).state.pathway).toEqual(first.pathway);
    expect(submitLevel(first, "A0", 2000)).toBe(first);
    const retake = {
      ...first,
      pathway: {
        ...first.pathway!,
        exams: { A0: { ...first.pathway!.exams.A0!, submitted: false } },
      },
    };
    expect(submitLevel(retake, "A0", 2000).xp).toBe(first.xp);
  });
  it("uses the new bank for an empty legacy draft but retains partial old answers", () => {
    const exam = { answers: {}, submitted: false, passed: false, best: 0, attempts: 0 };
    expect(examBankVersion(exam)).toBe(2);
    expect(examBankVersion({ ...exam, answers: { "a0-01:0": "saved" } })).toBe(1);
    expect(examBankVersion({ ...exam, version: 1 })).toBe(1);
  });
});
