import { z } from "zod";
import type { AppState } from "./store";

const rewardId = z
  .string()
  .max(1000)
  .regex(
    /^(?:step:(?:[1-9]|[12]\d|30):(?:review|words|phrases|dialogue|speaking|test)|module:[1-6]|unit:(?:a0|a1|a2|b1|b2|c1)-(?:0[1-9]|1[0-2])|exam:(?:A0|A1|A2|B1|B2|C1)|word:(?:a0|a1|a2|b1|b2|c1)-(?:0[1-9]|1[0-2]):v:.+)$/,
  );
const ids = z
  .array(rewardId)
  .max(2000)
  .refine((values) => new Set(values).size === values.length);
export const xpLedgerSchema = z
  .object({
    legacyXp: z.number().int().nonnegative().safe(),
    legacyClaims: ids,
    rewards: ids,
  })
  .strict()
  .refine((ledger) => ledger.rewards.every((id) => !ledger.legacyClaims.includes(id)));
export type XpLedger = z.infer<typeof xpLedgerSchema>;

function points(id: string): number {
  if (id.startsWith("word:")) return 1;
  if (id.startsWith("exam:")) return 50;
  if (id.startsWith("module:")) return 30;
  return 10;
}
export function ledgerTotal(ledger: XpLedger): number {
  return ledger.legacyXp + ledger.rewards.reduce((sum, id) => sum + points(id), 0);
}

/** Old totals are retained as-is; completed work cannot be rewarded again. */
export function ledgerFor(state: AppState): XpLedger {
  if (state.xpLedger) return state.xpLedger;
  const claims = [
    ...Object.entries(state.steps)
      .filter(([, done]) => done)
      .map(([id]) => `step:${id}`),
    ...Object.entries(state.examResults ?? {})
      .filter(([id, result]) => id.startsWith("module:") && result.passed)
      .map(([id]) => id),
    ...Object.entries(state.pathway?.units ?? {})
      .filter(([, unit]) => unit.passed)
      .map(([id]) => `unit:${id}`),
    ...Object.entries(state.pathway?.exams ?? {})
      .filter(([, exam]) => exam.passed)
      .map(([id]) => `exam:${id}`),
    ...Object.entries(state.pathway?.vocabulary ?? {})
      .filter(([, card]) => card.correct > 0)
      .map(([id]) => `word:${id}`),
  ].filter((id) => rewardId.safeParse(id).success);
  return { legacyXp: state.xp, legacyClaims: [...new Set(claims)].sort(), rewards: [] };
}

export function awardXp(state: AppState, id: string): AppState {
  rewardId.parse(id);
  const ledger = ledgerFor(state);
  const xpLedger =
    ledger.legacyClaims.includes(id) || ledger.rewards.includes(id)
      ? ledger
      : { ...ledger, rewards: [...ledger.rewards, id].sort() };
  return { ...state, xpLedger, xp: ledgerTotal(xpLedger) };
}

export function mergeXp(local: AppState, cloud: AppState): Pick<AppState, "xp" | "xpLedger"> {
  const left = ledgerFor(local);
  const right = ledgerFor(cloud);
  const legacyClaims = [...new Set([...left.legacyClaims, ...right.legacyClaims])].sort();
  const claimed = new Set(legacyClaims);
  const xpLedger: XpLedger = {
    legacyXp: Math.max(left.legacyXp, right.legacyXp),
    legacyClaims,
    rewards: [...new Set([...left.rewards, ...right.rewards])]
      .filter((id) => !claimed.has(id))
      .sort(),
  };
  // Historical snapshots do not identify every past reward. When their claims
  // overlap modern rewards, preserve the highest already-recorded total.
  const missingHistoricalXp = Math.max(local.xp, cloud.xp) - ledgerTotal(xpLedger);
  if (missingHistoricalXp > 0) xpLedger.legacyXp += missingHistoricalXp;
  return { xpLedger, xp: ledgerTotal(xpLedger) };
}
