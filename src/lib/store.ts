import { useEffect, useState, useCallback } from "react";
import type { Level } from "./content";

export interface CardState { box: number; due: number; correct: number; wrong: number }

export interface AppState {
  level: Level | null;
  day: number;
  xp: number;
  streak: number;
  lastActive: string | null;
  steps: Record<string, boolean>; // `${day}:${step}`
  cards: Record<string, CardState>;
  weakAreas: Record<string, number>;
}

const KEY = "speakup-state-v1";
const initial: AppState = { level: null, day: 1, xp: 0, streak: 0, lastActive: null, steps: {}, cards: {}, weakAreas: {} };

/** Spaced repetition: Leitner boxes, intervals in days. */
export const INTERVALS = [0, 1, 3, 7, 14, 30];

export function review(card: CardState | undefined, correct: boolean, now = Date.now()): CardState {
  const c = card ?? { box: 0, due: now, correct: 0, wrong: 0 };
  const box = correct ? Math.min(c.box + 1, INTERVALS.length - 1) : 0;
  return {
    box,
    due: now + INTERVALS[box]! * 86400000,
    correct: c.correct + (correct ? 1 : 0),
    wrong: c.wrong + (correct ? 0 : 1),
  };
}

function load(): AppState {
  try { return { ...initial, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return initial; }
}

export function useAppState() {
  const [state, setState] = useState<AppState>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => { setState(load()); setReady(true); }, []);
  const update = useCallback((fn: (s: AppState) => AppState) => {
    setState((prev) => { const next = fn(prev); localStorage.setItem(KEY, JSON.stringify(next)); return next; });
  }, []);
  return { state, update, ready };
}

export function touchStreak(s: AppState): AppState {
  const today = new Date().toDateString();
  if (s.lastActive === today) return s;
  const y = new Date(Date.now() - 86400000).toDateString();
  return { ...s, lastActive: today, streak: s.lastActive === y ? s.streak + 1 : 1 };
}

export function speak(text: string, rate = 1) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US"; u.rate = rate;
  window.speechSynthesis.speak(u);
}

export const STEPS = ["review", "words", "phrases", "dialogue", "speaking", "test"] as const;
export type Step = (typeof STEPS)[number];
export const STEP_LABELS: Record<Step, string> = {
  review: "Повторение", words: "Новые слова", phrases: "Фразы", dialogue: "Диалог", speaking: "Speaking", test: "Мини-тест",
};
