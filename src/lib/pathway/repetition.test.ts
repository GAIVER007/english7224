import { expect, it } from "vitest";
import { createInitialState } from "../store";
import { createBackup, parseBackup } from "../backup";
import { pathUnits } from "./index";
import { emptyUnit } from "./state";
import { saveUnit, startUnitReview, submitUnit, dueUnits } from "./progress";
import { pathwayPlan } from "./plan";
const unit = pathUnits[0]!;
const day = 86400000;
function answers() {
  return Object.fromEntries(unit.questions.map((q, i) => [i, q.answer]));
}
function prepared() {
  return saveUnit(createInitialState(), unit.id, {
    ...emptyUnit(),
    writing: Array(unit.writing.minWords).fill("word").join(" "),
    writingChecks: [true, true, true],
    speakingChecks: [true, true, true],
    answers: answers(),
  });
}
it("spaces successful due repeats and ignores early successful attempts", () => {
  let state = submitUnit(prepared(), unit, 1000);
  expect(state.pathway!.units[unit.id]).toMatchObject({ reviewBox: 0, due: 1000 + day });
  let next = saveUnit(startUnitReview(state, unit.id), unit.id, { answers: answers() });
  state = submitUnit(next, unit, 2000);
  expect(state.pathway!.units[unit.id]!.due).toBe(1000 + day);
  for (const [box, days] of [
    [1, 3],
    [2, 7],
    [3, 14],
    [4, 30],
    [4, 30],
  ]) {
    const now = state.pathway!.units[unit.id]!.due;
    next = saveUnit(startUnitReview(state, unit.id), unit.id, { answers: answers() });
    state = submitUnit(next, unit, now);
    expect(state.pathway!.units[unit.id]).toMatchObject({ reviewBox: box, due: now + days! * day });
  }
  expect(state.xp).toBe(10);
  expect(parseBackup(createBackup(state)).state.pathway).toEqual(state.pathway);
});
it("preserves drafts on re-entry and personal work when starting a new repeat", () => {
  const passed = submitUnit(prepared(), unit, 1000);
  const fresh = startUnitReview(passed, unit.id);
  expect(fresh.pathway!.units[unit.id]).toMatchObject({
    stage: 0,
    answers: {},
    submitted: false,
    passed: true,
    best: 6,
    writing: passed.pathway!.units[unit.id]!.writing,
  });
  const partial = saveUnit(fresh, unit.id, { stage: 4, answers: { "0": "partial" } });
  expect(startUnitReview(partial, unit.id)).toBe(partial);
  expect(fresh.xp).toBe(passed.xp);
  expect(fresh.pathway!.history).toEqual(passed.pathway!.history);
});
it("returns a failed repeat immediately and restarts its interval after correction", () => {
  const passed = submitUnit(prepared(), unit, 1000);
  const retry = saveUnit(startUnitReview(passed, unit.id), unit.id, {
    answers: Object.fromEntries(unit.questions.map((_, i) => [i, "wrong"])),
  });
  const failed = submitUnit(retry, unit, 2000);
  expect(failed.pathway!.units[unit.id]).toMatchObject({ reviewBox: 0, due: 2000, passed: true });
  expect(dueUnits(failed, 2000)).toEqual([unit]);
  const corrected = submitUnit(
    saveUnit(startUnitReview(failed, unit.id), unit.id, { answers: answers() }),
    unit,
    3000,
  );
  expect(corrected.pathway!.units[unit.id]!.due).toBe(3000 + day);
});
it("keeps old seven-day schedules and reviews older levels after moving on", () => {
  const state = saveUnit(createInitialState(), unit.id, {
    ...emptyUnit(),
    passed: true,
    best: 6,
    submitted: true,
    due: 1000,
  });
  state.pathway!.selected = "B1";
  expect(pathwayPlan(state, 1000)[0]).toMatchObject({ kind: "unit-review", unitId: unit.id });
  expect(state.pathway!.selected).toBe("B1");
  const withProduction = saveUnit(startUnitReview(state, unit.id), unit.id, {
    ...prepared().pathway!.units[unit.id],
    passed: true,
    best: 6,
    due: 1000,
  });
  expect(submitUnit(withProduction, unit, 1000).pathway!.units[unit.id]).toMatchObject({
    reviewBox: 3,
    due: 1000 + 14 * day,
  });
});
