import { expect, it } from "vitest";
import { createInitialState, validateAppStateForImport } from "./store";
import { practiceBalance } from "./practice-balance";
import { completeStep } from "./learning";
import { recordPractice } from "./motivation";

it("counts repeated practice once per skill and keeps the old state intact", () => {
  const original = createInitialState();
  const now = new Date(2026, 9, 24, 12);
  const once = recordPractice(original, now, "fluency");
  const twice = recordPractice(once, now, "fluency");
  expect(practiceBalance(twice, now).skills).toEqual(["fluency"]);
  expect(practiceBalance(twice, now).activeDays).toBe(1);
  expect(original.practiceSkills).toEqual({});
  expect(twice.xp).toBe(0);
});
it("counts practice within the Monday–Sunday week only", () => {
  const sunday = recordPractice(createInitialState(), new Date(2026, 9, 18, 23, 59), "input");
  expect(practiceBalance(sunday, new Date(2026, 9, 19)).skills).toEqual([]);
  const monday = recordPractice(createInitialState(), new Date(2026, 9, 19, 0, 1), "input");
  expect(practiceBalance(monday, new Date(2026, 9, 25, 23)).skills).toEqual(["input"]);
  expect(practiceBalance(monday, new Date(2026, 9, 26)).skills).toEqual([]);
});
it("imports old backups without inventing past skills and rejects invalid skills", () => {
  const state = createInitialState();
  delete state.practiceSkills;
  expect(validateAppStateForImport(state).practiceSkills).toEqual({});
  expect(() =>
    validateAppStateForImport({ ...state, practiceSkills: { "2026-10-24": ["fake"] } }),
  ).toThrow();
});

it("records the skill of completed course stages without duplicate rewards", () => {
  let state = createInitialState();
  for (const step of ["review", "words", "phrases", "dialogue", "speaking"] as const)
    state = completeStep(state, 1, step);
  expect(practiceBalance(state).skills).toEqual(["language", "input", "output"]);
  const duplicate = completeStep(state, 1, "speaking");
  expect(duplicate).toBe(state);
  expect(state.xp).toBe(50);
});
