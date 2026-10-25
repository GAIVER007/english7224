import { describe, expect, it } from "vitest";
import { pathUnits, PATH_LEVELS, unitsForLevel, levelQuestions } from "./index";
import { createInitialState } from "../store";
import { createBackup, parseBackup } from "../backup";
import { emptyPath, emptyUnit } from "./state";
import { canTakeLevel, saveUnit, submitLevel, submitUnit, wordCount } from "./progress";
import { personalRating } from "../rating";
function prepared(unit = pathUnits[0]!) {
  return saveUnit(createInitialState(), unit.id, {
    ...emptyUnit(),
    writing: Array(unit.writing.minWords).fill("word").join(" "),
    writingChecks: [true, true, true],
    speakingChecks: [true, true, true],
    answers: Object.fromEntries(unit.questions.map((q, i) => [String(i), q.answer])),
  });
}
describe("six-stage pathway", () => {
  it("has real original material and balanced assessments for every stage", () => {
    expect(pathUnits).toHaveLength(72);
    expect(new Set(pathUnits.map((u) => u.id)).size).toBe(72);
    for (const level of PATH_LEVELS) {
      expect(unitsForLevel(level)).toHaveLength(12);
      expect(levelQuestions(level)).toHaveLength(24);
      for (const skill of ["grammar", "reading", "listening"])
        expect(levelQuestions(level).filter((q) => q.skill === skill)).toHaveLength(8);
    }
    for (const u of pathUnits) {
      expect(u.id).toMatch(/^(a0|a1|a2|b1|b2|c1)-(0[1-9]|1[0-2])$/);
      expect(u.theory.length, u.id).toBeGreaterThan(80);
      expect(u.examples.length, u.id).toBeGreaterThanOrEqual(3);
      expect(u.vocabulary.length, u.id).toBeGreaterThanOrEqual(6);
      expect(u.reading, u.id).not.toBe(u.listening);
      expect(u.questions, u.id).toHaveLength(6);
      expect(u.writing.checklist, u.id).toHaveLength(3);
      expect(u.speaking.checklist, u.id).toHaveLength(3);
      expect(u.writing.minWords, u.id).toBeGreaterThan(0);
      expect(
        wordCount(u.writing.model),
        `${u.id}: writing model must meet the task minimum`,
      ).toBeGreaterThanOrEqual(u.writing.minWords);
      for (const skill of ["grammar", "reading", "listening"])
        expect(
          u.questions.filter((q) => q.skill === skill),
          u.id,
        ).toHaveLength(2);
      for (const q of u.questions) {
        expect(q.options, u.id).toContain(q.answer);
        expect(new Set(q.options).size, u.id).toBe(q.options.length);
        expect(q.options.length).toBeGreaterThanOrEqual(3);
        expect(q.explanation.length, u.id).toBeGreaterThan(10);
      }
    }
  });
  it("saves drafts and partial answers across backup restore without changing the legacy course", () => {
    const state = saveUnit({ ...createInitialState(), xp: 123, day: 7 }, pathUnits[0]!.id, {
      writing: "My saved draft",
      speakingNotes: "Slow down and finish the sentence.",
      speakingAttempts: 2,
      speakingSeconds: 25,
      stage: 3,
      answers: { "0": "partial" },
    });
    const restored = parseBackup(createBackup(state)).state;
    expect(restored.pathway?.units[pathUnits[0]!.id]?.writing).toBe("My saved draft");
    expect(restored.pathway?.units[pathUnits[0]!.id]?.stage).toBe(3);
    expect(restored.pathway?.units[pathUnits[0]!.id]?.speakingNotes).toBe(
      "Slow down and finish the sentence.",
    );
    expect(restored.pathway?.units[pathUnits[0]!.id]?.speakingAttempts).toBe(2);
    expect(restored.pathway?.units[pathUnits[0]!.id]?.speakingSeconds).toBe(25);
    expect(restored.xp).toBe(123);
    expect(restored.day).toBe(7);
  });
  it("requires production and all answers before awarding a unit", () => {
    const unit = pathUnits[0]!;
    const partial = saveUnit(prepared(unit), unit.id, { speakingChecks: [false, false, false] });
    expect(submitUnit(partial, unit)).toBe(partial);
    const unfinished = saveUnit(prepared(unit), unit.id, { answers: {} });
    expect(submitUnit(unfinished, unit)).toBe(unfinished);
  });
  it("records every completed attempt but rewards a unit only once", () => {
    const unit = pathUnits[0]!;
    const first = submitUnit(prepared(unit), unit, 1000);
    expect(first.xp).toBe(10);
    expect(first.pathway?.history).toHaveLength(1);
    expect(first.pathway?.units[unit.id]?.passed).toBe(true);
    expect(submitUnit(first, unit, 1001)).toBe(first);
    const retake = saveUnit(first, unit.id, {
      submitted: false,
      answers: Object.fromEntries(unit.questions.map((_, i) => [i, "incorrect"])),
    });
    const failed = submitUnit(retake, unit, 2000);
    expect(failed.xp).toBe(10);
    expect(failed.pathway?.history).toHaveLength(2);
    expect(failed.pathway?.units[unit.id]?.passed).toBe(true);
    expect(failed.pathway?.history[1]?.passed).toBe(false);
    expect(personalRating(failed).parts.find((p) => p.label === "Темы A0–C1")?.count).toBe(1);
  });
  it("unlocks the level assessment only after every unit and keeps its result", () => {
    let state = createInitialState();
    expect(canTakeLevel(state, "A0")).toBe(false);
    for (const u of unitsForLevel("A0")) {
      const p = prepared(u).pathway!.units[u.id]!;
      state = submitUnit(saveUnit(state, u.id, p), u, 1000);
    }
    expect(canTakeLevel(state, "A0")).toBe(true);
    const path = state.pathway ?? emptyPath();
    state = {
      ...state,
      pathway: {
        ...path,
        exams: {
          A0: {
            version: 2,
            answers: Object.fromEntries(levelQuestions("A0").map((q) => [q.id, q.answer])),
            submitted: false,
            passed: false,
            best: 0,
            attempts: 0,
          },
        },
      },
    };
    const passed = submitLevel(state, "A0", 2000);
    expect(passed.xp).toBe(170);
    expect(passed.pathway?.exams.A0?.passed).toBe(true);
    expect(submitLevel(passed, "A0")).toBe(passed);
    expect(parseBackup(createBackup(passed)).state.pathway).toEqual(passed.pathway);
  });
  it("migrates backups created before the pathway existed", () => {
    const old = createInitialState();
    delete old.pathway;
    expect(parseBackup(createBackup(old)).state.pathway).toEqual(emptyPath());
  });
});
