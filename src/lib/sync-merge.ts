import { mergeXp } from "./xp-ledger";
import type { AppState } from "./store";
import type { PathState } from "./pathway/state";

export interface SyncMergeConflict {
  local: AppState;
  cloud: AppState;
  reason?: "account-change";
}

export type SyncMergeResult =
  { state: AppState; conflict: null } | { state: null; conflict: SyncMergeConflict };

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (typeof value !== "object" || value === null) return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, canonical(entry)]),
  );
}

export function syncValuesEqual(left: unknown, right: unknown): boolean {
  return syncValueKey(left) === syncValueKey(right);
}

function syncValueKey(value: unknown): string {
  return JSON.stringify(canonical(value));
}

function atomic<T>(baseline: T, local: T, cloud: T): { local: T; cloud: T; conflict: boolean } {
  if (syncValuesEqual(local, cloud)) return { local, cloud: local, conflict: false };
  if (syncValuesEqual(local, baseline)) return { local: cloud, cloud, conflict: false };
  if (syncValuesEqual(cloud, baseline)) return { local, cloud: local, conflict: false };
  return { local, cloud, conflict: true };
}

function atomicRecord<T>(
  baseline: Record<string, T> | undefined,
  local: Record<string, T> | undefined,
  cloud: Record<string, T> | undefined,
): { local: Record<string, T>; cloud: Record<string, T>; conflict: boolean } {
  const localResult: Record<string, T> = {};
  const cloudResult: Record<string, T> = {};
  let conflict = false;
  const keys = new Set([
    ...Object.keys(baseline ?? {}),
    ...Object.keys(local ?? {}),
    ...Object.keys(cloud ?? {}),
  ]);
  for (const key of keys) {
    const result = atomic(baseline?.[key], local?.[key], cloud?.[key]);
    if (result.local !== undefined) localResult[key] = result.local;
    if (result.cloud !== undefined) cloudResult[key] = result.cloud;
    conflict ||= result.conflict;
  }
  return { local: localResult, cloud: cloudResult, conflict };
}

function maxRecord(
  local: Record<string, number> | undefined,
  cloud: Record<string, number> | undefined,
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const key of new Set([...Object.keys(local ?? {}), ...Object.keys(cloud ?? {})])) {
    result[key] = Math.max(local?.[key] ?? 0, cloud?.[key] ?? 0);
  }
  return result;
}

function booleanRecord(
  local: Record<string, boolean> | undefined,
  cloud: Record<string, boolean> | undefined,
): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const key of new Set([...Object.keys(local ?? {}), ...Object.keys(cloud ?? {})])) {
    result[key] = Boolean(local?.[key] || cloud?.[key]);
  }
  return result;
}

function unionRecord<T extends string>(
  local: Record<string, T[]> | undefined,
  cloud: Record<string, T[]> | undefined,
): Record<string, T[]> {
  const result: Record<string, T[]> = {};
  for (const key of new Set([...Object.keys(local ?? {}), ...Object.keys(cloud ?? {})])) {
    result[key] = [...new Set([...(local?.[key] ?? []), ...(cloud?.[key] ?? [])])];
  }
  return result;
}

function appendOnly<T>(baseline: T[], local: T[], cloud: T[], timestamp?: (entry: T) => number) {
  if (syncValuesEqual(local, cloud)) return { local, cloud: local, conflict: false };
  const baselineLength = baseline.length;
  const localExtendsBaseline = syncValuesEqual(local.slice(0, baselineLength), baseline);
  const cloudExtendsBaseline = syncValuesEqual(cloud.slice(0, baselineLength), baseline);
  if (!localExtendsBaseline || !cloudExtendsBaseline) return atomic(baseline, local, cloud);

  const merged = [...baseline];
  const seen = new Set(merged.map(syncValueKey));
  for (const entry of [...local.slice(baselineLength), ...cloud.slice(baselineLength)]) {
    const key = syncValueKey(entry);
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(entry);
    }
  }
  if (timestamp) merged.sort((left, right) => timestamp(left) - timestamp(right));
  return { local: merged, cloud: merged, conflict: false };
}

function mergePathway(
  baseline: PathState,
  local: PathState,
  cloud: PathState,
): { local: PathState; cloud: PathState; conflict: boolean } {
  const selected = atomic(baseline.selected, local.selected, cloud.selected);
  const vocabulary = atomicRecord(baseline.vocabulary, local.vocabulary, cloud.vocabulary);
  const units = atomicRecord(baseline.units, local.units, cloud.units);
  const exams = atomicRecord(baseline.exams, local.exams, cloud.exams);
  const history = appendOnly(baseline.history, local.history, cloud.history, (entry) => entry.at);
  return {
    local: {
      selected: selected.local,
      vocabulary: vocabulary.local,
      units: units.local,
      exams: exams.local,
      history: history.local,
    },
    cloud: {
      selected: selected.cloud,
      vocabulary: vocabulary.cloud,
      units: units.cloud,
      exams: exams.cloud,
      history: history.cloud,
    },
    conflict:
      selected.conflict ||
      vocabulary.conflict ||
      units.conflict ||
      exams.conflict ||
      history.conflict,
  };
}

/**
 * Conservatively combines changes made since the last successful sync.
 * Atomic learning records are never partially combined; divergent edits to the
 * same record are returned as an explicit choice for the learner.
 */
export function mergeAppStates(
  baseline: AppState,
  local: AppState,
  cloud: AppState,
): SyncMergeResult {
  const level = atomic(baseline.level, local.level, cloud.level);
  const activityRun = atomic(
    { lastActive: baseline.lastActive, streak: baseline.streak },
    { lastActive: local.lastActive, streak: local.streak },
    { lastActive: cloud.lastActive, streak: cloud.streak },
  );
  const dailyGoal = atomic(baseline.dailyGoal, local.dailyGoal, cloud.dailyGoal);
  const weeklyResult = atomic(baseline.weeklyResult, local.weeklyResult, cloud.weeklyResult);
  const tutorLessons = atomicRecord(baseline.tutorLessons, local.tutorLessons, cloud.tutorLessons);
  const cards = atomicRecord(baseline.cards, local.cards, cloud.cards);
  const examResults = atomicRecord(baseline.examResults, local.examResults, cloud.examResults);
  const grammarCards = atomicRecord(baseline.grammarCards, local.grammarCards, cloud.grammarCards);
  const grammarHistory = atomic(
    baseline.grammarHistory ?? [],
    local.grammarHistory ?? [],
    cloud.grammarHistory ?? [],
  );
  const pathway = mergePathway(baseline.pathway!, local.pathway!, cloud.pathway!);
  const resultHistory = appendOnly(
    baseline.resultHistory ?? [],
    local.resultHistory ?? [],
    cloud.resultHistory ?? [],
    (entry) => entry.completedAt,
  );

  const shared = {
    day: Math.max(local.day, cloud.day),
    ...mergeXp(local, cloud),
    steps: booleanRecord(local.steps, cloud.steps),
    weakAreas: maxRecord(local.weakAreas, cloud.weakAreas),
    practiceSkills: unionRecord(local.practiceSkills, cloud.practiceSkills),
    activity: maxRecord(local.activity, cloud.activity),
    earnedBadgeIds: [
      ...new Set([...(local.earnedBadgeIds ?? []), ...(cloud.earnedBadgeIds ?? [])]),
    ],
  };
  const localState: AppState = {
    ...local,
    ...shared,
    level: level.local,
    lastActive: activityRun.local.lastActive,
    streak: activityRun.local.streak,
    dailyGoal: dailyGoal.local!,
    tutorLessons: tutorLessons.local,
    cards: cards.local,
    examResults: examResults.local,
    grammarCards: grammarCards.local,
    grammarHistory: grammarHistory.local,
    pathway: pathway.local,
    resultHistory: resultHistory.local,
  };
  const cloudState: AppState = {
    ...cloud,
    ...shared,
    level: level.cloud,
    lastActive: activityRun.cloud.lastActive,
    streak: activityRun.cloud.streak,
    dailyGoal: dailyGoal.cloud!,
    tutorLessons: tutorLessons.cloud,
    cards: cards.cloud,
    examResults: examResults.cloud,
    grammarCards: grammarCards.cloud,
    grammarHistory: grammarHistory.cloud,
    pathway: pathway.cloud,
    resultHistory: resultHistory.cloud,
  };
  if (weeklyResult.local === undefined) delete localState.weeklyResult;
  else localState.weeklyResult = weeklyResult.local;
  if (weeklyResult.cloud === undefined) delete cloudState.weeklyResult;
  else cloudState.weeklyResult = weeklyResult.cloud;
  const conflict =
    level.conflict ||
    activityRun.conflict ||
    dailyGoal.conflict ||
    weeklyResult.conflict ||
    tutorLessons.conflict ||
    cards.conflict ||
    examResults.conflict ||
    grammarCards.conflict ||
    grammarHistory.conflict ||
    pathway.conflict ||
    resultHistory.conflict;
  return conflict
    ? { state: null, conflict: { local: localState, cloud: cloudState } }
    : { state: localState, conflict: null };
}
