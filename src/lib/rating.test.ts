import { describe, expect, it } from "vitest";
import { createInitialState } from "./store";
import { personalRating, practiceRecords } from "./rating";
import { earnedBadges } from "./motivation";

describe("personal rating", () => {
  it("starts at zero and counts each completed activity only once", () => {
    const state = createInitialState();
    expect(personalRating(state).score).toBe(0);
    const practiced = {
      ...state,
      steps: { "1:test": true, "1:speaking": true, "999:test": true },
      activity: { "2026-10-24": 50 },
    };
    expect(personalRating(practiced).score).toBe(35);
    expect(personalRating({ ...practiced, activity: { "2026-10-24": 500 } }).score).toBe(35);
  });
  it("only awards passed modules and opens the exact next league threshold", () => {
    const state = {
      ...createInitialState(),
      examResults: {
        "module:1": { correct: 12, total: 15, completedAt: 1, passed: true },
        "module:2": { correct: 10, total: 15, completedAt: 1, passed: false },
      },
      activity: Object.fromEntries([1, 2, 3, 4, 5].map((day) => [`2026-10-0${day}`, 1])),
    };
    expect(personalRating(state)).toMatchObject({
      score: 100,
      league: { title: "Бронза" },
      percent: 0,
    });
    expect(earnedBadges(state).find((badge) => badge.id === "first-module")?.earned).toBe(true);
    expect(earnedBadges(state).find((badge) => badge.id === "all-modules")?.earned).toBe(false);
  });
  it("keeps the longest historical streak across month boundaries and gaps", () => {
    const state = {
      ...createInitialState(),
      activity: {
        "2026-03-01": 2,
        "2026-02-28": 1,
        "2026-02-27": 1,
        "2026-03-04": 1,
        "2026-03-05": 0,
      },
    };
    expect(practiceRecords(state)).toEqual({ activeDays: 4, bestStreak: 3 });
  });
  it("retains earned milestones after live conditions change", () => {
    expect(
      earnedBadges({ ...createInitialState(), earnedBadgeIds: ["speaking-10"] }).find(
        (badge) => badge.id === "speaking-10",
      )?.earned,
    ).toBe(true);
  });
});
