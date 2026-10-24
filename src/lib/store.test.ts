import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialState, resetAppState, review, touchStreak, useAppState } from "./store";

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
            weeklyResult: { completedAt: 123, correct: 6, total: 5, areas: {} },
          }),
          storageArea: localStorage,
        }),
      ),
    );

    expect(hook.result.current.state.xp).toBe(80);
    expect(hook.result.current.state.day).toBe(1);
    expect(hook.result.current.state.cards).toEqual({});
    expect(hook.result.current.state.weeklyResult).toBeUndefined();
    expect(hook.result.current.storageError).toContain("repaired");
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

  it("resets only the app storage key", async () => {
    localStorage.setItem("unrelated", "keep");
    const hook = renderHook(() => useAppState());
    await waitFor(() => expect(hook.result.current.ready).toBe(true));
    act(() => hook.result.current.update((state) => ({ ...state, xp: 10 })));

    act(() => resetAppState());

    expect(localStorage.getItem("speakup-state-v1")).toBeNull();
    expect(localStorage.getItem("unrelated")).toBe("keep");
    expect(hook.result.current.state).toEqual(createInitialState());
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
