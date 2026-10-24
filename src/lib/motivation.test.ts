import { describe, expect, it } from "vitest";
import { completeStep } from "./learning";
import {
  dailyProgress,
  earnedBadges,
  learnerRank,
  localDateKey,
  recordPractice,
  weeklyActivity,
} from "./motivation";
import { createInitialState } from "./store";

describe("daily practice", () => {
  it("uses local calendar dates and records one action without mutating prior state", () => {
    const state = createInitialState();
    const now = new Date(2026, 9, 24, 23, 30);
    const next = recordPractice(state, now);

    expect(localDateKey(now)).toBe("2026-10-24");
    expect(next.activity).toEqual({ "2026-10-24": 1 });
    expect(state.activity).toEqual({});
  });

  it("honors the selected goal and caps visible progress", () => {
    const now = new Date(2026, 9, 24, 12);
    const state = {
      ...createInitialState(),
      dailyGoal: 3 as const,
      activity: { "2026-10-24": 4 },
    };

    expect(dailyProgress(state, now)).toEqual({
      count: 4,
      goal: 3,
      percent: 100,
      completed: true,
    });
  });

  it("counts a completed lesson stage once after the idempotence guard", () => {
    const state = createInitialState();
    const completed = completeStep(state, 1, "review");
    const duplicate = completeStep(completed, 1, "review");

    expect(dailyProgress(completed).count).toBe(1);
    expect(duplicate).toBe(completed);
    expect(dailyProgress(duplicate).count).toBe(1);
  });
});

describe("weekly activity", () => {
  it("returns the last seven local dates in chronological order with actual counts", () => {
    const state = {
      ...createInitialState(),
      activity: {
        "2024-03-04": 2,
        "2024-03-09": 1,
        "2024-03-10": 4,
      },
    };
    const days = weeklyActivity(state, new Date(2024, 2, 10, 12));

    expect(days.map(({ date, count }) => ({ date, count }))).toEqual([
      { date: "2024-03-04", count: 2 },
      { date: "2024-03-05", count: 0 },
      { date: "2024-03-06", count: 0 },
      { date: "2024-03-07", count: 0 },
      { date: "2024-03-08", count: 0 },
      { date: "2024-03-09", count: 1 },
      { date: "2024-03-10", count: 4 },
    ]);
    expect(days.filter((day) => day.isToday).map((day) => day.date)).toEqual(["2024-03-10"]);
    expect(days.every((day) => day.label.length > 0)).toBe(true);
  });
});

describe("motivation rewards", () => {
  it("returns game ranks independently from language levels", () => {
    expect(learnerRank(0)).toEqual({
      level: 1,
      title: "Новичок",
      currentXp: 0,
      neededXp: 60,
      percent: 0,
    });
    expect(learnerRank(90)).toMatchObject({
      level: 2,
      title: "Исследователь",
      currentXp: 90,
      neededXp: 120,
      percent: 50,
    });
    expect(learnerRank(2_000)).toMatchObject({
      level: 5,
      currentXp: 2_000,
      neededXp: 300,
      percent: 100,
    });
  });

  it("derives earned and locked badges from completed lessons, cards, and streak", () => {
    const cards = Object.fromEntries(
      Array.from({ length: 10 }, (_, index) => [
        `word-${index}`,
        { box: index < 9 ? 2 : 1, due: 0, correct: 1, wrong: 0 },
      ]),
    );
    const badges = earnedBadges({
      ...createInitialState(),
      streak: 3,
      steps: { "1:test": true },
      cards,
    });
    const status = Object.fromEntries(badges.map((badge) => [badge.id, badge.earned]));

    expect(status).toMatchObject({
      "first-lesson": true,
      "five-lessons": false,
      "ten-words": true,
      "ten-mastered": false,
      "streak-3": true,
      "streak-7": false,
    });
    expect(badges.every((badge) => badge.title && badge.description)).toBe(true);
  });

  it("keeps previously earned badges visible after their live condition changes", () => {
    const badges = earnedBadges({
      ...createInitialState(),
      earnedBadgeIds: ["streak-7", "ten-mastered"],
    });
    const status = Object.fromEntries(badges.map((badge) => [badge.id, badge.earned]));

    expect(status["streak-7"]).toBe(true);
    expect(status["ten-mastered"]).toBe(true);
    expect(status["first-lesson"]).toBe(false);
  });
});
