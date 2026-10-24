import { useCallback, useSyncExternalStore } from "react";
import { z } from "zod";
import type { Level } from "./content";
import { BADGE_IDS, earnedBadgeIdsForState, type BadgeId } from "./motivation";

export interface CardState {
  box: number;
  due: number;
  correct: number;
  wrong: number;
}
export interface WeeklyResult {
  completedAt: number;
  correct: number;
  total: number;
  areas: Record<string, { correct: number; total: number }>;
}

export type DailyGoal = 3 | 5 | 10;

export interface AppState {
  level: Level | null;
  day: number;
  xp: number;
  streak: number;
  lastActive: string | null;
  steps: Record<string, boolean>; // `${day}:${step}`
  cards: Record<string, CardState>;
  weakAreas: Record<string, number>;
  dailyGoal?: DailyGoal;
  activity?: Record<string, number>;
  earnedBadgeIds?: BadgeId[];
  weeklyResult?: WeeklyResult;
}

const KEY = "speakup-state-v1";

export function createInitialState(): AppState {
  return {
    level: null,
    day: 1,
    xp: 0,
    streak: 0,
    lastActive: null,
    steps: {},
    cards: {},
    weakAreas: {},
    dailyGoal: 5,
    activity: {},
    earnedBadgeIds: [],
  };
}

/** Spaced repetition: Leitner boxes, intervals in days. */
export const INTERVALS = [0, 1, 3, 7, 14, 30];

const nonNegativeInteger = z.number().int().nonnegative().finite();
const finiteNumber = z.number().finite();
const cardSchema = z
  .object({
    box: nonNegativeInteger.max(INTERVALS.length - 1),
    due: finiteNumber,
    correct: nonNegativeInteger,
    wrong: nonNegativeInteger,
  })
  .passthrough();
const weeklyAreaSchema = z
  .object({ correct: nonNegativeInteger, total: nonNegativeInteger })
  .passthrough()
  .refine((area) => area.correct <= area.total, {
    message: "Correct answers cannot exceed total answers.",
  });
const weeklyResultSchema = z
  .object({
    completedAt: nonNegativeInteger,
    correct: nonNegativeInteger,
    total: nonNegativeInteger,
    areas: z.record(weeklyAreaSchema),
  })
  .passthrough()
  .refine((result) => result.correct <= result.total, {
    message: "Correct answers cannot exceed total answers.",
  });
const fieldSchemas = {
  level: z.enum(["A1", "A2", "B1", "B2", "C1"]).nullable(),
  day: nonNegativeInteger.min(1),
  xp: nonNegativeInteger,
  streak: nonNegativeInteger,
  lastActive: z.string().min(1).nullable(),
  steps: z.record(z.boolean()),
  cards: z.record(cardSchema),
  weakAreas: z.record(finiteNumber.nonnegative()),
  dailyGoal: z.union([z.literal(3), z.literal(5), z.literal(10)]),
  activity: z.record(z.string().regex(/^\d{4}-\d{2}-\d{2}$/), nonNegativeInteger),
  earnedBadgeIds: z.array(z.enum(BADGE_IDS)),
} satisfies Record<keyof Omit<AppState, "weeklyResult">, z.ZodTypeAny>;
const migratedDefaultFields = new Set(["dailyGoal", "activity", "earnedBadgeIds"]);

interface StoreSnapshot {
  state: AppState;
  ready: boolean;
  storageError: string | null;
}
const serverSnapshot: StoreSnapshot = {
  state: createInitialState(),
  ready: false,
  storageError: null,
};
let snapshot: StoreSnapshot = serverSnapshot;
let hydrated = false;
let storageListenerAttached = false;
const listeners = new Set<() => void>();

function errorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message) return message;
  }
  return fallback;
}

function normalizeState(value: unknown): { state: AppState; repaired: boolean } {
  const defaults = createInitialState();
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { state: defaults, repaired: true };
  }
  const source = value as Record<string, unknown>;
  const normalized: Record<string, unknown> = { ...source };
  let repaired = false;
  for (const [field, schema] of Object.entries(fieldSchemas)) {
    if (source[field] === undefined && migratedDefaultFields.has(field)) {
      normalized[field] = defaults[field as keyof typeof defaults];
      continue;
    }
    const result = schema.safeParse(source[field]);
    if (result.success) normalized[field] = result.data;
    else {
      normalized[field] = defaults[field as keyof typeof defaults];
      repaired = true;
    }
  }
  if (source["weeklyResult"] !== undefined) {
    const result = weeklyResultSchema.safeParse(source["weeklyResult"]);
    if (result.success) normalized["weeklyResult"] = result.data;
    else {
      delete normalized["weeklyResult"];
      repaired = true;
    }
  }
  const state = normalized as unknown as AppState;
  state.earnedBadgeIds = earnedBadgeIdsForState(state);
  return { state, repaired };
}

function parseStoredState(raw: string | null): { state: AppState; repaired: boolean } {
  if (raw === null) return { state: createInitialState(), repaired: false };
  try {
    return normalizeState(JSON.parse(raw));
  } catch {
    return { state: createInitialState(), repaired: true };
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}
function replaceSnapshot(next: StoreSnapshot) {
  snapshot = next;
  emit();
}

function readStorage(): { state: AppState; storageError: string | null } {
  try {
    const parsed = parseStoredState(window.localStorage.getItem(KEY));
    return {
      state: parsed.state,
      storageError: parsed.repaired
        ? "Saved progress contained invalid data and was repaired."
        : null,
    };
  } catch (error) {
    return {
      state: createInitialState(),
      storageError: errorMessage(error, "Saved progress could not be read."),
    };
  }
}

function hydrateFromStorage() {
  if (typeof window === "undefined") return;
  hydrated = true;
  replaceSnapshot({ ...readStorage(), ready: true });
}
function ensureHydrated() {
  if (!hydrated && typeof window !== "undefined") hydrateFromStorage();
}

function persist(state: AppState): string | null {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    return null;
  } catch (error) {
    return errorMessage(error, "Progress could not be saved.");
  }
}

function handleStorage(event: StorageEvent) {
  if (event.key !== KEY && event.key !== null) return;
  const parsed = parseStoredState(event.key === null ? null : event.newValue);
  replaceSnapshot({
    state: parsed.state,
    ready: true,
    storageError: parsed.repaired
      ? "Saved progress contained invalid data and was repaired."
      : null,
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (typeof window !== "undefined" && !storageListenerAttached) {
    window.addEventListener("storage", handleStorage);
    storageListenerAttached = true;
    hydrateFromStorage();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && storageListenerAttached) {
      window.removeEventListener("storage", handleStorage);
      storageListenerAttached = false;
    }
  };
}

export function updateAppState(fn: (state: AppState) => AppState) {
  ensureHydrated();
  const normalized = normalizeState(fn(snapshot.state));
  const state = {
    ...normalized.state,
    earnedBadgeIds: [
      ...new Set([
        ...(snapshot.state.earnedBadgeIds ?? []),
        ...(normalized.state.earnedBadgeIds ?? []),
      ]),
    ],
  };
  const storageError = typeof window === "undefined" ? null : persist(state);
  replaceSnapshot({ state, ready: true, storageError });
}

export function resetAppState() {
  ensureHydrated();
  const state = createInitialState();
  let storageError: string | null = null;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
    } catch (error) {
      storageError = errorMessage(error, "Progress could not be reset.");
    }
  }
  replaceSnapshot({ state, ready: true, storageError });
}

export function useAppState() {
  const current = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => serverSnapshot,
  );
  const update = useCallback(updateAppState, []);
  return { ...current, update, reset: resetAppState };
}

export function review(card: CardState | undefined, correct: boolean, now = Date.now()): CardState {
  const current = card ?? { box: 0, due: now, correct: 0, wrong: 0 };
  const box = correct ? Math.min(current.box + 1, INTERVALS.length - 1) : 0;
  return {
    box,
    due: now + INTERVALS[box]! * 86400000,
    correct: current.correct + (correct ? 1 : 0),
    wrong: current.wrong + (correct ? 0 : 1),
  };
}

export function touchStreak(state: AppState, now: number | Date = Date.now()): AppState {
  const todayDate = new Date(now);
  const today = todayDate.toDateString();
  if (state.lastActive === today) return state;
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  return {
    ...state,
    lastActive: today,
    streak: state.lastActive === yesterdayDate.toDateString() ? state.streak + 1 : 1,
  };
}

export function speak(text: string, rate = 1) {
  if (typeof window === "undefined") return;
  const report = () => window.dispatchEvent(new Event("speakup-audio-error"));
  if (!("speechSynthesis" in window)) {
    report();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.onerror = (event) => {
      if (event.error !== "interrupted" && event.error !== "canceled") report();
    };
    window.speechSynthesis.speak(utterance);
  } catch {
    report();
  }
}

export const STEPS = ["review", "words", "phrases", "dialogue", "speaking", "test"] as const;
export type Step = (typeof STEPS)[number];
export const STEP_LABELS: Record<Step, string> = {
  review: "Повторение",
  words: "Новые слова",
  phrases: "Фразы",
  dialogue: "Диалог",
  speaking: "Speaking",
  test: "Мини-тест",
};
