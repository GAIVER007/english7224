import { describe, expect, it } from "vitest";
import { createInitialState, type AppState } from "./store";
import { emptyUnit } from "./pathway/state";
import { mergeAppStates, syncValuesEqual } from "./sync-merge";

function state(patch: Partial<AppState> = {}): AppState {
  return { ...createInitialState(), ...patch };
}

describe("three-way progress merge", () => {
  it("treats JSON objects with reordered keys as equal", () => {
    expect(
      syncValuesEqual({ a: 1, nested: { b: 2, c: 3 } }, { nested: { c: 3, b: 2 }, a: 1 }),
    ).toBe(true);
  });

  it("combines independent progress without adding XP twice", () => {
    const baseline = state({ xp: 10 });
    const local = state({ xp: 20, steps: { "1:words": true } });
    const cloud = state({ xp: 30, steps: { "1:test": true } });

    const result = mergeAppStates(baseline, local, cloud);

    expect(result.conflict).toBeNull();
    expect(result.state).toMatchObject({
      xp: 30,
      steps: { "1:words": true, "1:test": true },
    });
  });

  it("combines records changed on different devices and appends unique histories", () => {
    const baseline = state();
    const local = state({
      cards: { hello: { box: 1, due: 10, correct: 1, wrong: 0 } },
      resultHistory: [{ kind: "lesson", number: 1, completedAt: 10, correct: 7, total: 7 }],
    });
    const cloud = state({
      cards: { world: { box: 2, due: 20, correct: 2, wrong: 0 } },
      resultHistory: [{ kind: "lesson", number: 2, completedAt: 20, correct: 6, total: 7 }],
    });

    const result = mergeAppStates(baseline, local, cloud);

    expect(result.conflict).toBeNull();
    expect(Object.keys(result.state!.cards)).toEqual(["hello", "world"]);
    expect(result.state!.resultHistory).toHaveLength(2);
  });

  it("requires a choice for divergent edits to the same writing draft", () => {
    const baseline = state();
    const baseUnit = emptyUnit();
    baseline.pathway!.units["a0-01"] = baseUnit;
    const local = structuredClone(baseline);
    const cloud = structuredClone(baseline);
    local.pathway!.units["a0-01"] = { ...baseUnit, writing: "Local draft" };
    cloud.pathway!.units["a0-01"] = { ...baseUnit, writing: "Cloud draft" };
    local.pathway!.history.push({
      id: "a0-02",
      at: 10,
      correct: 5,
      total: 6,
      passed: true,
    });

    const result = mergeAppStates(baseline, local, cloud);

    expect(result.state).toBeNull();
    expect(result.conflict?.local.pathway?.units["a0-01"]?.writing).toBe("Local draft");
    expect(result.conflict?.cloud.pathway?.units["a0-01"]?.writing).toBe("Cloud draft");
    expect(result.conflict?.cloud.pathway?.history).toEqual(local.pathway!.history);
  });

  it("accepts the normalized initial baseline on a first sign-in", () => {
    const baseline = createInitialState();
    const local = createInitialState();
    const cloud = state({ xp: 50, level: "A1" });

    const result = mergeAppStates(baseline, local, cloud);

    expect(result.conflict).toBeNull();
    expect(result.state).toMatchObject({ xp: 50, level: "A1" });
  });

  it("preserves a deliberate removal of the latest weekly result", () => {
    const weeklyResult = { completedAt: 10, correct: 8, total: 9, areas: {} };
    const baseline = state({ weeklyResult });
    const local = state({ weeklyResult });
    const cloud = state();

    const result = mergeAppStates(baseline, local, cloud);

    expect(result.conflict).toBeNull();
    expect(result.state?.weeklyResult).toBeUndefined();
  });
});
