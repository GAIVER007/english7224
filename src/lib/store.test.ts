import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { earnedBadges } from "./motivation";
import {
  createInitialState,
  resetAppState,
  restoreAppState,
  review,
  touchStreak,
  useAppState,
} from "./store";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  resetAppState();
});

describe("shared app state", () => {
  it("hydrates persisted progress for a newly mounted consumer", async () => {
    localStorage.setItem(
      "speakup-state-v1",
      JSON.stringify({ ...createInitialState(), xp: 35, day: 3 }),
    );

    const hook = renderHook(() => useAppState());

    await waitFor(() => expect(hook.result.current.ready).toBe(true));
    expect(hook.result.current.state).toMatchObject({ xp: 35, day: 3 });
  });

  it("updates every mounted consumer and persists the result", async () => {
    const first = renderHook(() => useAppState());
    const second = renderHook(() => useAppState());
    await waitFor(() => expect(first.result.current.ready).toBe(true));

    act(() => first.result.current.update((state) => ({ ...state, xp: 25 })));

    expect(first.result.current.state.xp).toBe(25);
    expect(second.result.current.state.xp).toBe(25);
    expect(JSON.parse(localStorage.getItem("speakup-state-v1") ?? "{}").xp).toBe(25);
  });

  it("accepts cross-tab updates and preserves valid future fields", async () => {
    const hook = renderHook(() => useAppState());
    await waitFor(() => expect(hook.result.current.ready).toBe(true));
    const saved = {
      ...createInitialState(),
      xp: 40,
      futureSetting: { enabled: true },
      weeklyResult: {
        completedAt: 123,
        correct: 4,
        total: 5,
        areas: { grammar: { correct: 2, total: 3 } },
      },
    };

    act(() =>
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "speakup-state-v1",
          newValue: JSON.stringify(saved),
          storageArea: localStorage,
        }),
      ),
    );

    expect(hook.result.current.state.xp).toBe(40);
    expect(hook.result.current.state.weeklyResult?.areas["grammar"]).toEqual({
      correct: 2,
      total: 3,
    });
    expect(hook.result.current.state).toMatchObject({ futureSetting: { enabled: true } });
  });

  it("repairs corrupt persisted fields without discarding valid progress", async () => {
    const hook = renderHook(() => useAppState());
    await waitFor(() => expect(hook.result.current.ready).toBe(true));

    act(() =>
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "speakup-state-v1",
          newValue: JSON.stringify({
            ...createInitialState(),
            xp: 80,
            day: "third",
            cards: [],
            dailyGoal: 8,
            activity: { "2026-10-24": "many" },
            earnedBadgeIds: ["not-a-real-badge"],
            weeklyResult: { completedAt: 123, correct: 6, total: 5, areas: {} },
          }),
          storageArea: localStorage,
        }),
      ),
    );

    expect(hook.result.current.state.xp).toBe(80);
    expect(hook.result.current.state.day).toBe(1);
    expect(hook.result.current.state.cards).toEqual({});
    expect(hook.result.current.state.dailyGoal).toBe(5);
    expect(hook.result.current.state.activity).toEqual({});
    expect(hook.result.current.state.earnedBadgeIds).toEqual([]);
    expect(hook.result.current.state.weeklyResult).toBeUndefined();
    expect(hook.result.current.storageError).toContain("repaired");
  });

  it("migrates legacy progress to daily defaults without treating it as corrupt", async () => {
    localStorage.setItem(
      "speakup-state-v1",
      JSON.stringify({
        level: "A2",
        day: 2,
        xp: 60,
        streak: 1,
        lastActive: "Fri Oct 24 2026",
        steps: { "1:test": true },
        cards: {},
        weakAreas: {},
      }),
    );

    const hook = renderHook(() => useAppState());
    await waitFor(() => expect(hook.result.current.ready).toBe(true));

    expect(hook.result.current.state).toMatchObject({
      day: 2,
      xp: 60,
      dailyGoal: 5,
      activity: {},
      earnedBadgeIds: ["first-lesson"],
      examResults: {},
    });
    expect(hook.result.current.storageError).toBeNull();
  });

  it("migrates completed legacy lessons without inventing exam results or resetting progress", async () => {
    localStorage.setItem(
      "speakup-state-v1",
      JSON.stringify({
        level: "A2",
        day: 11,
        xp: 600,
        streak: 4,
        lastActive: "Fri Oct 24 2026",
        steps: Object.fromEntries(
          Array.from({ length: 10 }, (_, index) => [`${index + 1}:test`, true]),
        ),
        cards: {},
        weakAreas: {},
      }),
    );

    const hook = renderHook(() => useAppState());
    await waitFor(() => expect(hook.result.current.ready).toBe(true));

    expect(hook.result.current.state).toMatchObject({ day: 11, xp: 600, examResults: {} });
    expect(hook.result.current.storageError).toBeNull();
  });

  it("repairs invalid stored exam records while preserving unrelated progress", async () => {
    localStorage.setItem(
      "speakup-state-v1",
      JSON.stringify({
        ...createInitialState(),
        day: 4,
        xp: 210,
        examResults: {
          "lesson:3": { correct: 8, total: 7, completedAt: 10, passed: true },
        },
      }),
    );

    const hook = renderHook(() => useAppState());
    await waitFor(() => expect(hook.result.current.ready).toBe(true));

    expect(hook.result.current.state).toMatchObject({ day: 4, xp: 210, examResults: {} });
    expect(hook.result.current.storageError).toContain("repaired");
  });

  it("rejects invalid exam records in imported backups", async () => {
    const hook = renderHook(() => useAppState());
    await waitFor(() => expect(hook.result.current.ready).toBe(true));
    const invalid = {
      ...createInitialState(),
      examResults: {
        wrongKey: { correct: 7, total: 7, completedAt: 10, passed: true },
      },
    };

    expect(() => restoreAppState(invalid)).toThrow(/examResults.*недопустимое/i);
    expect(() =>
      restoreAppState({
        ...createInitialState(),
        examResults: {
          "module:999": { correct: 1, total: 1, completedAt: 10, passed: true },
        },
      }),
    ).toThrow(/examResults.*недопустимое/i);
  });

  it("keeps in-memory state usable when localStorage writes fail", async () => {
    const hook = renderHook(() => useAppState());
    await waitFor(() => expect(hook.result.current.ready).toBe(true));
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota exceeded", "QuotaExceededError");
    });

    act(() => hook.result.current.update((state) => ({ ...state, xp: 15 })));

    expect(hook.result.current.state.xp).toBe(15);
    expect(hook.result.current.storageError).toContain("Quota exceeded");
  });

  it("keeps earned badges after later updates reset streak and cards", async () => {
    const hook = renderHook(() => useAppState());
    await waitFor(() => expect(hook.result.current.ready).toBe(true));
    const masteredCards = Object.fromEntries(
      Array.from({ length: 10 }, (_, index) => [
        `word-${index}`,
        { box: 2, due: 0, correct: 2, wrong: 0 },
      ]),
    );

    act(() =>
      hook.result.current.update((state) => ({ ...state, streak: 3, cards: masteredCards })),
    );
    expect(hook.result.current.state.earnedBadgeIds).toEqual([
      "ten-words",
      "ten-mastered",
      "streak-3",
    ]);

    act(() => hook.result.current.update((state) => ({ ...state, streak: 0, cards: {} })));

    expect(hook.result.current.state.earnedBadgeIds).toEqual([
      "ten-words",
      "ten-mastered",
      "streak-3",
    ]);
    expect(
      earnedBadges(hook.result.current.state)
        .filter((badge) => badge.earned)
        .map((badge) => badge.id),
    ).toEqual(["ten-words", "ten-mastered", "streak-3"]);
  });

  it("restores a validated state by replacement without merging current progress", async () => {
    const hook = renderHook(() => useAppState());
    await waitFor(() => expect(hook.result.current.ready).toBe(true));
    act(() =>
      hook.result.current.update((state) => ({
        ...state,
        xp: 300,
        streak: 7,
        cards: { old: { box: 4, due: 0, correct: 5, wrong: 0 } },
      })),
    );
    const restored = {
      ...createInitialState(),
      level: "A1" as const,
      xp: 20,
      steps: { "1:review": true },
      earnedBadgeIds: [],
    };

    act(() => restoreAppState(restored));

    expect(hook.result.current.state).toEqual(restored);
    expect(hook.result.current.state.cards).toEqual({});
    expect(hook.result.current.state.earnedBadgeIds).toEqual([]);
    expect(JSON.parse(localStorage.getItem("speakup-state-v1") ?? "null")).toEqual(restored);
  });

  it("leaves prior progress untouched when restore persistence fails", async () => {
    const hook = renderHook(() => useAppState());
    await waitFor(() => expect(hook.result.current.ready).toBe(true));
    act(() => hook.result.current.update((state) => ({ ...state, xp: 80, day: 2 })));
    const before = hook.result.current.state;
    const persistedBefore = localStorage.getItem("speakup-state-v1");
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota exceeded", "QuotaExceededError");
    });

    expect(() => restoreAppState({ ...createInitialState(), xp: 999 })).toThrow(
      /не удалось сохранить.*текущие данные не изменены/i,
    );

    expect(hook.result.current.state).toBe(before);
    expect(localStorage.getItem("speakup-state-v1")).toBe(persistedBefore);
  });

  it("rejects an impossible restored day before persistence and keeps current progress", async () => {
    const hook = renderHook(() => useAppState());
    await waitFor(() => expect(hook.result.current.ready).toBe(true));
    act(() => hook.result.current.update((state) => ({ ...state, xp: 80, day: 2 })));
    const before = hook.result.current.state;
    const persistedBefore = localStorage.getItem("speakup-state-v1");
    const storageSpy = vi.spyOn(Storage.prototype, "setItem");

    expect(() => restoreAppState({ ...createInitialState(), day: 999 })).toThrow(
      /день, которого нет.*новой версии/i,
    );

    expect(storageSpy).not.toHaveBeenCalled();
    expect(hook.result.current.state).toBe(before);
    expect(localStorage.getItem("speakup-state-v1")).toBe(persistedBefore);
  });

  it("resets only the app storage key", async () => {
    localStorage.setItem("unrelated", "keep");
    const hook = renderHook(() => useAppState());
    await waitFor(() => expect(hook.result.current.ready).toBe(true));
    act(() => hook.result.current.update((state) => ({ ...state, xp: 10 })));

    act(() => resetAppState());

    expect(localStorage.getItem("speakup-state-v1")).toBeNull();
    expect(localStorage.getItem("unrelated")).toBe("keep");
    expect(hook.result.current.state).toEqual(createInitialState());
    expect(hook.result.current.state.earnedBadgeIds).toEqual([]);
    localStorage.removeItem("unrelated");
  });
});

describe("spaced repetition", () => {
  it("correct answer increases interval", () => {
    const card = review({ box: 1, due: 0, correct: 1, wrong: 0 }, true, 0);
    expect(card.box).toBe(2);
    expect(card.due).toBe(3 * 86400000);
  });

  it("mistake returns word sooner", () => {
    const card = review({ box: 3, due: 0, correct: 3, wrong: 0 }, false, 0);
    expect(card.box).toBe(0);
    expect(card.due).toBe(0);
  });
});

describe("streak", () => {
  it("uses the previous calendar day across daylight-saving changes", () => {
    const previousTimezone = process.env["TZ"];
    process.env["TZ"] = "America/Los_Angeles";
    try {
      const sunday = new Date("2024-03-10T12:00:00-07:00").toDateString();
      const monday = new Date("2024-03-11T00:30:00-07:00");
      const result = touchStreak(
        { ...createInitialState(), streak: 3, lastActive: sunday },
        monday,
      );

      expect(result.streak).toBe(4);
      expect(result.lastActive).toBe(monday.toDateString());
    } finally {
      process.env["TZ"] = previousTimezone;
    }
  });
});
