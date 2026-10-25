import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const transport = vi.hoisted(() => ({
  row: null as { state: unknown; updated_at: string; user_id: string } | null,
  readError: false,
  readGate: null as Promise<void> | null,
  inserts: 0,
  updates: 0,
  reads: 0,
  beforeUpdate: null as (() => void) | null,
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => {
            transport.reads += 1;
            await transport.readGate;
            return transport.readError
              ? { data: null, error: new Error("offline") }
              : { data: transport.row, error: null };
          },
        }),
      }),
      insert: (value: { state: unknown; updated_at: string; user_id: string }) => ({
        select: () => ({
          maybeSingle: async () => {
            transport.inserts += 1;
            if (transport.row) return { data: null, error: { code: "23505" } };
            transport.row = value;
            return { data: { updated_at: value.updated_at }, error: null };
          },
        }),
      }),
      update: (value: { state: unknown; updated_at: string }) => ({
        eq: () => ({
          eq: (_column: string, expected: string) => ({
            select: () => ({
              maybeSingle: async () => {
                transport.updates += 1;
                const beforeUpdate = transport.beforeUpdate;
                transport.beforeUpdate = null;
                beforeUpdate?.();
                if (!transport.row || transport.row.updated_at !== expected) {
                  return { data: null, error: null };
                }
                transport.row = { ...transport.row, ...value };
                return { data: { updated_at: value.updated_at }, error: null };
              },
            }),
          }),
        }),
      }),
    }),
  },
}));

import {
  getSyncConflict,
  getSyncStatus,
  resolveSyncConflict,
  retrySync,
  startSync,
  stopSync,
} from "./cloud-sync";
import { createInitialState, getAppState, restoreAppState } from "./store";

describe("cloud progress synchronization", () => {
  afterEach(() => stopSync());
  beforeEach(() => {
    stopSync();
    localStorage.clear();
    transport.row = null;
    transport.readError = false;
    transport.readGate = null;
    transport.inserts = 0;
    transport.updates = 0;
    transport.reads = 0;
    transport.beforeUpdate = null;
    restoreAppState(createInitialState());
  });

  it("merges a valid first-sign-in cloud copy and saves the baseline", async () => {
    transport.row = {
      user_id: "one",
      updated_at: "2026-10-25T00:00:00.000Z",
      state: { ...createInitialState(), xp: 40, steps: { "1:test": true } },
    };
    restoreAppState({ ...createInitialState(), xp: 10, steps: { "1:words": true } });

    await startSync("one");

    expect(getSyncStatus()).toBe("saved");
    expect(getAppState()).toMatchObject({
      xp: 40,
      steps: { "1:words": true, "1:test": true },
    });
    expect(localStorage.getItem("speakup-sync-baseline-v1:one")).not.toBeNull();
  });

  it("reports divergent edits to the same card and resolves only after a choice", async () => {
    const local = createInitialState();
    local.cards["word"] = { box: 1, due: 10, correct: 1, wrong: 0 };
    restoreAppState(local);
    transport.row = {
      user_id: "one",
      updated_at: "2026-10-25T00:00:00.000Z",
      state: {
        ...createInitialState(),
        cards: { word: { box: 2, due: 20, correct: 2, wrong: 0 } },
      },
    };

    await startSync("one");

    expect(getSyncStatus()).toBe("conflict");
    expect(getSyncConflict()?.local.cards["word"]?.box).toBe(1);
    expect(getSyncConflict()?.cloud.cards["word"]?.box).toBe(2);
    expect(transport.updates).toBe(0);

    await resolveSyncConflict("local");
    expect(getSyncStatus()).toBe("saved");
    expect((transport.row?.state as ReturnType<typeof createInitialState>).cards["word"]?.box).toBe(
      1,
    );
  });

  it("does not restore or upload an invalid remote state", async () => {
    restoreAppState({ ...createInitialState(), xp: 12 });
    transport.row = {
      user_id: "one",
      updated_at: "2026-10-25T00:00:00.000Z",
      state: { broken: true },
    };

    await startSync("one");

    expect(getSyncStatus()).toBe("error");
    expect(getAppState().xp).toBe(12);
    expect(transport.inserts).toBe(0);
    expect(transport.updates).toBe(0);
  });

  it("retries after an initial network failure", async () => {
    transport.readError = true;
    restoreAppState({ ...createInitialState(), xp: 12 });
    await startSync("one");
    expect(getSyncStatus()).toBe("error");

    transport.readError = false;
    await retrySync();

    expect(getSyncStatus()).toBe("saved");
    expect(transport.inserts).toBe(1);
  });

  it("keeps a local edit made while the initial read is pending", async () => {
    let release = () => {};
    transport.readGate = new Promise<void>((resolve) => {
      release = resolve;
    });
    transport.row = {
      user_id: "one",
      updated_at: "2026-10-25T00:00:00.000Z",
      state: createInitialState(),
    };

    const syncing = startSync("one");
    await Promise.resolve();
    restoreAppState({ ...createInitialState(), xp: 25 });
    release();
    await syncing;

    expect(getAppState().xp).toBe(25);
    expect((transport.row.state as ReturnType<typeof createInitialState>).xp).toBe(25);
  });

  it("keeps a different account blocked through retries until an explicit choice", async () => {
    localStorage.setItem("speakup-sync-owner-v1", "one");
    restoreAppState({ ...createInitialState(), xp: 25 });
    transport.row = {
      user_id: "two",
      updated_at: "2026-10-25T00:00:00.000Z",
      state: { ...createInitialState(), xp: 80 },
    };

    await startSync("two");
    expect(getSyncStatus()).toBe("conflict");
    await retrySync();

    expect(getSyncStatus()).toBe("conflict");
    expect(transport.updates).toBe(0);
    expect(getSyncConflict()?.local.xp).toBe(25);
    expect(getSyncConflict()?.cloud.xp).toBe(80);
    expect(getSyncConflict()?.reason).toBe("account-change");
  });

  it("refreshes a conflict before resolving so a newer local edit is preserved", async () => {
    const local = createInitialState();
    local.cards["word"] = { box: 1, due: 10, correct: 1, wrong: 0 };
    restoreAppState(local);
    transport.row = {
      user_id: "one",
      updated_at: "2026-10-25T00:00:00.000Z",
      state: {
        ...createInitialState(),
        cards: { word: { box: 2, due: 20, correct: 2, wrong: 0 } },
      },
    };
    await startSync("one");

    let release = () => {};
    transport.readGate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const resolving = resolveSyncConflict("local");
    await Promise.resolve();
    const newer = structuredClone(getAppState());
    newer.xp = 15;
    newer.steps["1:words"] = true;
    newer.cards["word"] = { box: 3, due: 30, correct: 3, wrong: 0 };
    restoreAppState(newer);
    release();
    await resolving;

    const saved = transport.row.state as ReturnType<typeof createInitialState>;
    expect(saved.xp).toBe(15);
    expect(saved.steps["1:words"]).toBe(true);
    expect(saved.cards["word"]?.box).toBe(3);
  });

  it("tags the first account even when offline so its data cannot leak to the next account", async () => {
    restoreAppState({ ...createInitialState(), xp: 25 });
    transport.readError = true;
    await startSync("one");
    expect(getSyncStatus()).toBe("error");
    stopSync();

    transport.readError = false;
    transport.row = {
      user_id: "two",
      updated_at: "2026-10-25T00:00:00.000Z",
      state: { ...createInitialState(), xp: 80 },
    };
    await startSync("two");

    expect(getSyncStatus()).toBe("conflict");
    expect(transport.updates).toBe(0);
  });

  it("fails closed before cloud access when the account owner marker cannot be read", async () => {
    restoreAppState({ ...createInitialState(), xp: 25 });
    const storage = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });

    await startSync("one");
    storage.mockRestore();

    expect(getSyncStatus()).toBe("error");
    expect(transport.reads).toBe(0);
    expect(transport.inserts).toBe(0);
    expect(transport.updates).toBe(0);
  });

  it("re-reads and merges after a conditional update collision", async () => {
    restoreAppState({ ...createInitialState(), xp: 25, steps: { "1:words": true } });
    transport.row = {
      user_id: "one",
      updated_at: "2026-10-25T00:00:00.000Z",
      state: createInitialState(),
    };
    transport.beforeUpdate = () => {
      transport.row = {
        user_id: "one",
        updated_at: "2026-10-25T00:00:01.000Z",
        state: { ...createInitialState(), xp: 40, steps: { "1:test": true } },
      };
    };

    await startSync("one");

    const saved = transport.row.state as ReturnType<typeof createInitialState>;
    expect(getSyncStatus()).toBe("saved");
    expect(transport.updates).toBe(2);
    expect(saved.xp).toBe(40);
    expect(saved.steps).toEqual({ "1:words": true, "1:test": true });
  });

  it("does not reclaim another tab's account after an in-flight write completes", async () => {
    transport.row = {
      user_id: "one",
      updated_at: "2026-10-25T00:00:00.000Z",
      state: createInitialState(),
    };
    restoreAppState({ ...createInitialState(), xp: 10 });
    transport.beforeUpdate = () => {
      localStorage.setItem("speakup-sync-owner-v1", "two");
      restoreAppState({ ...createInitialState(), xp: 300 });
    };
    await startSync("one");
    expect(localStorage.getItem("speakup-sync-owner-v1")).toBe("two");
    expect(getAppState().xp).toBe(300);
    expect(getSyncConflict()?.reason).toBe("account-change");
    expect((transport.row!.state as { xp: number }).xp).toBe(10);
  });

  it("blocks an active session if another tab changes the working-copy owner during a read", async () => {
    transport.row = {
      user_id: "one",
      updated_at: "2026-10-25T00:00:00.000Z",
      state: createInitialState(),
    };
    await startSync("one");
    transport.updates = 0;

    let release = () => {};
    transport.readGate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const syncing = retrySync();
    await Promise.resolve();
    localStorage.setItem("speakup-sync-owner-v1", "two");
    restoreAppState({ ...createInitialState(), xp: 75 });
    release();
    await syncing;

    expect(getSyncStatus()).toBe("conflict");
    expect(getSyncConflict()?.reason).toBe("account-change");
    expect(transport.updates).toBe(0);
    expect((transport.row.state as ReturnType<typeof createInitialState>).xp).toBe(0);

    await resolveSyncConflict("local");
    expect(getSyncStatus()).toBe("saved");
    expect(localStorage.getItem("speakup-sync-owner-v1")).toBe("one");
    expect((transport.row.state as ReturnType<typeof createInitialState>).xp).toBe(75);
  });
});
