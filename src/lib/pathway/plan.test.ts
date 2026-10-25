import { describe, expect, it } from "vitest";
import { createInitialState, type AppState } from "../store";
import { pathVocabularyWords } from "./vocabulary";
import { emptyPath, emptyUnit } from "./state";
import { pathwayPlan, revisionUnits } from "./plan";
import { unitsForLevel } from "./index";
import type { PathLevel } from "./types";

function passedLevel(level: PathLevel, due: number): AppState {
  const state = createInitialState();
  state.pathway = {
    ...emptyPath(),
    selected: level,
    units: Object.fromEntries(
      unitsForLevel(level).map((unit) => [
        unit.id,
        { ...emptyUnit(), passed: true, best: 6, submitted: true, due },
      ]),
    ),
    exams: {},
  };
  return state;
}

describe("adaptive pathway plan", () => {
  it("starts a new learner with the first selected-level unit without mutating progress", () => {
    const state = createInitialState();
    state.xp = 37;
    const before = structuredClone(state);

    expect(pathwayPlan(state, 1_000)[0]).toMatchObject({
      kind: "next-unit",
      unitId: unitsForLevel("A0")[0]!.id,
    });
    expect(state).toEqual(before);
  });

  it("prioritizes due vocabulary before exam remediation and unfinished work", () => {
    const state = createInitialState();
    const [reviewUnit, unfinishedUnit] = unitsForLevel("A0");
    const word = pathVocabularyWords(reviewUnit!)[0]!;
    state.pathway = {
      ...emptyPath(),
      vocabulary: { [word.id]: { box: 1, due: 500, correct: 1, wrong: 0 } },
      units: { [unfinishedUnit!.id]: { ...emptyUnit(), stage: 3, writing: "draft" } },
      history: [
        {
          id: "exam:A0",
          at: 400,
          correct: 18,
          total: 24,
          passed: false,
          reviewUnitIds: [reviewUnit!.id],
        },
      ],
    };

    expect(
      pathwayPlan(state, 500)
        .map((action) => action.kind)
        .slice(0, 3),
    ).toEqual(["word-review", "remediation", "resume-unit"]);
  });

  it("uses only the latest selected-level exam and clears a topic after a later pass", () => {
    const state = createInitialState();
    const [oldUnit, currentUnit] = unitsForLevel("A0");
    state.pathway = {
      ...emptyPath(),
      history: [
        {
          id: "exam:A0",
          at: 100,
          correct: 18,
          total: 24,
          passed: false,
          reviewUnitIds: [oldUnit!.id],
        },
        {
          id: "exam:A0",
          at: 200,
          correct: 19,
          total: 24,
          passed: false,
          reviewUnitIds: [currentUnit!.id],
        },
      ],
    };
    expect(revisionUnits(state).map((unit) => unit.id)).toEqual([currentUnit!.id]);

    state.pathway.history.push({
      id: currentUnit!.id,
      at: 201,
      correct: 5,
      total: 6,
      passed: true,
    });
    expect(revisionUnits(state)).toEqual([]);
  });

  it("offers a due passed unit before the next unpassed unit", () => {
    const state = createInitialState();
    const [dueUnit] = unitsForLevel("A0");
    state.pathway = {
      ...emptyPath(),
      units: {
        [dueUnit!.id]: { ...emptyUnit(), passed: true, best: 6, submitted: true, due: 900 },
      },
    };

    expect(
      pathwayPlan(state, 1_000)
        .map((action) => action.kind)
        .slice(0, 2),
    ).toEqual(["unit-review", "next-unit"]);
  });

  it("moves from a ready exam to an explicit next-level choice without changing selection or XP", () => {
    const state = passedLevel("A0", 9_000);
    state.xp = 120;
    expect(pathwayPlan(state, 1_000)[0]?.kind).toBe("level-exam");

    state.pathway!.exams.A0 = {
      version: 2,
      answers: {},
      submitted: true,
      passed: true,
      best: 22,
      attempts: 1,
    };
    const action = pathwayPlan(state, 1_000)[0];
    expect(action).toMatchObject({ kind: "next-level", selectLevel: "A1" });
    expect(state.pathway!.selected).toBe("A0");
    expect(state.xp).toBe(120);
  });

  it("falls back to the completed state after the C1 exam", () => {
    const state = passedLevel("C1", 9_000);
    state.pathway!.exams.C1 = {
      version: 2,
      answers: {},
      submitted: true,
      passed: true,
      best: 24,
      attempts: 1,
    };
    expect(pathwayPlan(state, 1_000)).toEqual([
      expect.objectContaining({ kind: "complete", search: {} }),
    ]);
  });
});
