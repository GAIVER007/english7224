import { describe, expect, it } from "vitest";
import { createInitialState, validateAppStateForImport } from "./store";
import { awardXp, mergeXp } from "./xp-ledger";
import { createBackup, parseBackup } from "./backup";
import { mergeAppStates } from "./sync-merge";
import { emptyPath, emptyUnit } from "./pathway/state";

describe("stable XP reward journal", () => {
  it("adds independent offline rewards and deduplicates the same reward across devices", () => {
    const base = { ...createInitialState(), xp: 120 };
    const phone = awardXp(awardXp(base, "unit:a0-01"), "unit:a0-02");
    const laptop = awardXp(awardXp(base, "unit:a0-01"), "exam:A0");
    const merged = { ...base, ...mergeXp(phone, laptop) };
    expect(merged.xp).toBe(190);
    expect(mergeXp(laptop, phone)).toEqual(mergeXp(phone, laptop));
    expect(mergeXp(merged, laptop)).toEqual(mergeXp(phone, laptop));
    expect(awardXp(merged, "unit:a0-01").xp).toBe(190);
  });

  it("preserves the old total and remembers historical claimed rewards", () => {
    const old = { ...createInitialState(), xp: 480, steps: { "1:words": true } };
    expect(awardXp(old, "step:1:words").xp).toBe(480);
    const next = awardXp(old, "step:1:phrases");
    expect(next.xp).toBe(490);
    expect(next.xpLedger?.legacyClaims).toContain("step:1:words");
    expect(mergeXp(next, old).xp).toBe(490);
  });

  it("uses historical claims to avoid double-counting a reward from an older client", () => {
    const base = createInitialState();
    const modern = awardXp(base, "step:1:words");
    const old = { ...base, xp: 10, steps: { "1:words": true } };
    expect(mergeXp(modern, old).xp).toBe(10);
  });

  it("never lowers an existing total when an older snapshot claims a modern reward", () => {
    const modern = awardXp({ ...createInitialState(), xp: 120 }, "unit:a0-01");
    const old = {
      ...createInitialState(),
      xp: 100,
      pathway: { ...emptyPath(), units: { "a0-01": { ...emptyUnit(), passed: true, best: 6 } } },
    };
    validateAppStateForImport(old);
    validateAppStateForImport(modern);
    const merged = mergeXp(modern, old);
    expect(merged.xp).toBe(130);
    expect(mergeXp(old, modern)).toEqual(merged);
    expect(mergeXp({ ...modern, ...merged }, old)).toEqual(merged);
  });

  it("round-trips the journal and rejects inconsistent or forged reward amounts", () => {
    const state = awardXp(awardXp(createInitialState(), "module:1"), "unit:b1-12");
    expect(parseBackup(createBackup(state)).state).toEqual(state);
    expect(() => validateAppStateForImport({ ...state, xp: 999 })).toThrow(/Журнал XP/);
    expect(() =>
      validateAppStateForImport({
        ...state,
        xpLedger: { ...state.xpLedger, rewards: ["unknown:10"] },
      }),
    ).toThrow(/Журнал XP/);
    expect(() =>
      validateAppStateForImport({
        ...state,
        xpLedger: { ...state.xpLedger, rewards: ["module:1", "module:1"] },
      }),
    ).toThrow(/Журнал XP/);
  });

  it("retains the merged XP in both conflict choices without rewarding a resync", () => {
    const base = createInitialState();
    const local = { ...awardXp(base, "unit:a0-01"), level: "A1" as const };
    const cloud = { ...awardXp(base, "unit:a0-02"), level: "A2" as const };
    const result = mergeAppStates(base, local, cloud);
    expect(result.conflict?.local.xp).toBe(20);
    expect(result.conflict?.cloud.xp).toBe(20);
    const resolved = result.conflict!.local;
    expect(mergeXp(resolved, cloud).xp).toBe(20);
  });
});
