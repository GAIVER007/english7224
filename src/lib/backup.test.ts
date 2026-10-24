import { describe, expect, it } from "vitest";
import { MAX_BACKUP_BYTES, createBackup, parseBackup } from "./backup";
import { createInitialState, type AppState } from "./store";

function completeState(): AppState {
  return {
    ...createInitialState(),
    level: "B1",
    day: 4,
    xp: 170,
    streak: 2,
    lastActive: "Sat Oct 24 2026",
    steps: { "1:review": true, "1:words": true },
    cards: {
      greeting: { box: 3, due: 123_456, correct: 5, wrong: 1 },
    },
    weakAreas: { listening: 2 },
    dailyGoal: 10,
    activity: { "2026-10-23": 4, "2026-10-24": 7 },
    earnedBadgeIds: ["streak-7"],
    weeklyResult: {
      completedAt: 987_654,
      correct: 5,
      total: 6,
      areas: { Vocabulary: { correct: 2, total: 2 } },
    },
  };
}

describe("progress backups", () => {
  it("round-trips every progress field with a versioned export date", () => {
    const state = completeState();
    const exportedAt = new Date("2026-10-24T12:34:56.000Z");
    const preview = parseBackup(createBackup(state, exportedAt));

    expect(preview.exportedAt).toBe(exportedAt.toISOString());
    expect(preview.state).toEqual(state);
  });

  it("supports migrations for backups created before optional fields existed", () => {
    const legacy = {
      kind: "speakup-progress",
      version: 1,
      exportedAt: "2026-10-24T12:00:00.000Z",
      state: {
        level: "A2",
        day: 2,
        xp: 60,
        streak: 1,
        lastActive: "Sat Oct 24 2026",
        steps: { "1:test": true },
        cards: {},
        weakAreas: {},
      },
    };

    expect(parseBackup(JSON.stringify(legacy)).state).toMatchObject({
      dailyGoal: 5,
      activity: {},
      earnedBadgeIds: ["first-lesson"],
    });
  });

  it("accepts the completion marker immediately after the final course day", () => {
    const state = { ...completeState(), day: 6 };

    expect(parseBackup(createBackup(state)).state.day).toBe(6);
  });

  it("rejects corrupt progress instead of repairing it", () => {
    const backup = JSON.parse(createBackup(completeState())) as {
      state: Record<string, unknown>;
    };
    backup.state["xp"] = "a lot";

    expect(() => parseBackup(JSON.stringify(backup))).toThrow(/некорректный прогресс.*xp/i);
  });

  it("rejects a day that does not exist in this course version", () => {
    const backup = JSON.parse(createBackup(completeState())) as {
      state: Record<string, unknown>;
    };
    backup.state["day"] = 999;

    expect(() => parseBackup(JSON.stringify(backup))).toThrow(/день, которого нет.*новой версии/i);
  });

  it("rejects unsupported versions, malformed JSON, and oversized files", () => {
    const unsupported = JSON.parse(createBackup(completeState())) as Record<string, unknown>;
    unsupported["version"] = 2;

    expect(() => parseBackup(JSON.stringify(unsupported))).toThrow(/версия.*не поддерживается/i);
    expect(() => parseBackup("not json")).toThrow(/повреждён.*неверный формат/i);
    expect(() => parseBackup("x".repeat(MAX_BACKUP_BYTES + 1))).toThrow(/слишком большой/i);
  });
});
