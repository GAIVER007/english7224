import { describe, it, expect } from "vitest";
import { createInitialState } from "./store";
import { lessons } from "./content";
import { studyPlan } from "./study-plan";

describe("personal study recommendations", () => {
  it("offers a lesson without inventing weaknesses for a new learner", () => {
    const plan = studyPlan(createInitialState());
    expect(plan[0]?.id).toBe("lesson");
    expect(plan.map((a) => a.id)).not.toContain("mistakes");
  });
  it("keeps an unfinished lesson ahead of due reviews", () => {
    const state = createInitialState();
    state.steps["1:words"] = true;
    state.cards[lessons[0]!.words[0]!.id] = { box: 0, due: 0, correct: 0, wrong: 1 };
    expect(studyPlan(state)[0]?.id).toBe("lesson");
    expect(studyPlan(state)[1]?.id).toBe("review");
  });
  it("offers due review without hiding the next lesson", () => {
    const state = createInitialState();
    state.cards[lessons[0]!.words[0]!.id] = { box: 0, due: 100, correct: 0, wrong: 1 };
    expect(studyPlan(state, 100).map((a) => a.id)).toEqual(["review", "lesson", "mistakes"]);
    expect(studyPlan(state, 99)[0]?.id).toBe("lesson");
  });
  it("prioritizes mandatory module exams even after the final lesson", () => {
    const state = { ...createInitialState(), day: 31 };
    expect(studyPlan(state)[0]?.search).toEqual({ module: 1 });
  });
  it("uses recent grammar evidence only after ten attempts", () => {
    const state = { ...createInitialState(), grammarHistory: Array<boolean>(9).fill(false) };
    expect(studyPlan(state).some((a) => a.id === "grammar")).toBe(false);
    state.grammarHistory.push(false);
    expect(studyPlan(state).some((a) => a.id === "grammar")).toBe(true);
    state.grammarHistory = [...state.grammarHistory, ...Array<boolean>(20).fill(true)];
    expect(studyPlan(state).some((a) => a.id === "grammar")).toBe(false);
  });
});
