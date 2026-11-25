import { assignmentLibrary, tutorHistory, type TeacherAssignment, type TutorLesson } from "./tutor";
import { useCallback, useSyncExternalStore } from "react";
import { z } from "zod";
import { xpLedgerSchema, ledgerTotal, type XpLedger } from "./xp-ledger";
import { PRACTICE_SKILLS, type PracticeSkill } from "./practice-balance";
import { lessons, type Level } from "./content";
import { courseModules } from "./curriculum";
import { BADGE_IDS, earnedBadgeIdsForState, type BadgeId } from "./motivation";

import { pathStateSchema, emptyPath, type PathState } from "./pathway/state";

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

export interface ExamResult {
  correct: number;
  total: number;
  completedAt: number;
  passed: boolean;
}

export interface ResultRecord {
  kind: "lesson" | "module" | "weekly";
  number: number;
  completedAt: number;
  correct: number;
  total: number;
}

export type DailyGoal = 3 | 5 | 10;

export interface AppState {
  level: Level | null;
  day: number;
  xp: number;
  xpLedger?: XpLedger;
  streak: number;
  lastActive: string | null;
  steps: Record<string, boolean>; // `${day}:${step}`
  cards: Record<string, CardState>;
  weakAreas: Record<string, number>;
  dailyGoal?: DailyGoal; // Legacy backup compatibility; no longer a learner-facing target.
  practiceSkills?: Record<string, PracticeSkill[]>;
  activity?: Record<string, number>;
  earnedBadgeIds?: BadgeId[];
  weeklyResult?: WeeklyResult;
  examResults?: Record<string, ExamResult>;
  grammarHistory?: boolean[];
  grammarCards?: Record<string, CardState>;
  pathway?: PathState;
  teacherAssignments?: Record<string, TeacherAssignment>;
  tutorLessons?: Record<string, TutorLesson>;
  resultHistory?: ResultRecord[];
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
    practiceSkills: {},
    activity: {},
    earnedBadgeIds: [],
    examResults: {},
    grammarHistory: [],
    grammarCards: {},
    pathway: emptyPath(),
    teacherAssignments: {},
    tutorLessons: {},
    resultHistory: [],
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
const examResultSchema = z
  .object({
    correct: nonNegativeInteger,
    total: nonNegativeInteger.min(1),
    completedAt: nonNegativeInteger,
    passed: z.boolean(),
  })
  .strict()
  .refine((result) => result.correct <= result.total, {
    message: "Correct answers cannot exceed total answers.",
  })
  .refine(
    (result) => {
      const scorePassed = result.correct * 100 >= result.total * 80;
      return result.passed === scorePassed;
    },
    { message: "Exam pass status must match its score." },
  );
const examResultsSchema = z
  .record(z.string().regex(/^(lesson|module):\d+$/), examResultSchema)
  .superRefine((results, context) => {
    for (const [key, result] of Object.entries(results)) {
      const [kind, rawId] = key.split(":");
      const id = Number(rawId);
      const expectedTotal = kind === "lesson" ? 7 : 15;
      const highestId = kind === "lesson" ? lessons.length : courseModules.length;
      if (id < 1 || id > highestId || result.total !== expectedTotal) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: "Exam key or total is outside the current course.",
        });
      }
    }
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
  examResults: examResultsSchema,
  grammarHistory: z.array(z.boolean()).max(100),
  grammarCards: z.record(cardSchema),
  pathway: pathStateSchema,
  teacherAssignments: assignmentLibrary,
  tutorLessons: tutorHistory,
  resultHistory: z.array(
    z
      .object({
        kind: z.enum(["lesson", "module", "weekly"]),
        number: nonNegativeInteger,
        completedAt: nonNegativeInteger,
        correct: nonNegativeInteger,
        total: nonNegativeInteger.min(1),
      })
      .strict()
      .refine(
        (r) =>
          r.correct <= r.total &&
          (r.kind === "lesson"
            ? r.number >= 1 && r.number <= lessons.length && r.total === 7
            : r.kind === "module"
              ? r.number >= 1 && r.number <= courseModules.length && r.total === 15
              : r.number === 0 && r.total <= 9),
      ),
  ),
  practiceSkills: z.record(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    z.array(z.enum(PRACTICE_SKILLS)).max(4),
  ),
} satisfies Record<keyof Omit<AppState, "weeklyResult" | "xpLedger">, z.ZodTypeAny>;
const migratedDefaultFields = new Set([
  "dailyGoal",
  "practiceSkills",
  "activity",
  "earnedBadgeIds",
  "examResults",
  "grammarHistory",
  "grammarCards",
  "pathway",
  "resultHistory",
  "tutorLessons",
  "teacherAssignments",
]);

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
  if (source["xpLedger"] !== undefined) {
    const ledger = xpLedgerSchema.safeParse(source["xpLedger"]);
    if (
      ledger.success &&
      Number.isSafeInteger(ledgerTotal(ledger.data)) &&
      ledgerTotal(ledger.data) === normalized["xp"]
    ) {
      normalized["xpLedger"] = ledger.data;
    } else {
      delete normalized["xpLedger"];
      repaired = true;
    }
  }
  const state = normalized as unknown as AppState;
  state.earnedBadgeIds = earnedBadgeIdsForState(state);
  return { state, repaired };
}

export function validateAppStateForImport(value: unknown): AppState {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Данные прогресса должны быть объектом.");
  }
  const defaults = createInitialState();
  const source = value as Record<string, unknown>;
  const validated: Record<string, unknown> = { ...source };

  for (const [field, schema] of Object.entries(fieldSchemas)) {
    if (source[field] === undefined && migratedDefaultFields.has(field)) {
      validated[field] = defaults[field as keyof typeof defaults];
      continue;
    }
    const result = schema.safeParse(source[field]);
    if (!result.success) {
      throw new Error(`Поле прогресса «${field}» содержит недопустимое значение.`);
    }
    validated[field] = result.data;
  }

  if ((validated["day"] as number) > lessons.length + 1) {
    throw new Error(
      "В копии указан день, которого нет в текущей версии курса. Возможно, копия создана в более новой версии SpeakUp.",
    );
  }

  if (source["weeklyResult"] !== undefined) {
    const result = weeklyResultSchema.safeParse(source["weeklyResult"]);
    if (!result.success) {
      throw new Error("Поле прогресса «weeklyResult» содержит недопустимое значение.");
    }
    validated["weeklyResult"] = result.data;
  } else {
    delete validated["weeklyResult"];
  }

  if (source["xpLedger"] !== undefined) {
    const ledger = xpLedgerSchema.safeParse(source["xpLedger"]);
    if (
      !ledger.success ||
      !Number.isSafeInteger(ledgerTotal(ledger.data)) ||
      ledgerTotal(ledger.data) !== validated["xp"]
    ) {
      throw new Error("Журнал XP не соответствует сохранённому рейтингу.");
    }
    validated["xpLedger"] = ledger.data;
  } else {
    delete validated["xpLedger"];
  }
  const state = validated as unknown as AppState;
  state.earnedBadgeIds = earnedBadgeIdsForState(state);
  return state;
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
  if (event.storageArea && event.storageArea !== window.localStorage) return;
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

export function getAppState(): AppState {
  ensureHydrated();
  return snapshot.state;
}

/** Listen to every progress change (used by cloud sync). */
export function onAppStateChange(listener: () => void) {
  return subscribe(listener);
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

export function restoreAppState(value: unknown) {
  ensureHydrated();
  const state = validateAppStateForImport(value);
  if (typeof window !== "undefined") {
    const storageError = persist(state);
    if (storageError) {
      throw new Error("Не удалось сохранить восстановленный прогресс. Текущие данные не изменены.");
    }
  }
  replaceSnapshot({ state, ready: true, storageError: null });
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

export function speak(text: string, rate = 1, language: "en-US" | "ru-RU" = "en-US") {
  if (typeof window === "undefined") return;
  const report = () => window.dispatchEvent(new Event("speakup-audio-error"));
  if (!("speechSynthesis" in window)) {
    report();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
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
  test: "Мини-экзамен",
};
