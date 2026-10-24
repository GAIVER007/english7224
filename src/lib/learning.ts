import { lessons, placementQuestions, levels, type Level, type Word } from "./content";
import { recordPractice } from "./motivation";
import { STEPS, touchStreak, type AppState, type Step } from "./store";

export const wordPool = lessons.flatMap((lesson) => lesson.words);
export const PASS_PERCENT = 70;

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

export function dueWords(state: AppState, now = Date.now()): Word[] {
  return wordPool
    .filter((word) => {
      const card = state.cards[word.id];
      return card !== undefined && card.due <= now;
    })
    .sort((a, b) => state.cards[a.id]!.due - state.cards[b.id]!.due);
}

export function canOpenStep(state: AppState, day: number, step: Step): boolean {
  return (
    day === state.day &&
    STEPS.slice(0, STEPS.indexOf(step)).every((s) => state.steps[`${day}:${s}`])
  );
}

export function completeStep(state: AppState, day: number, step: Step): AppState {
  const key = `${day}:${step}`;
  if (day > lessons.length || !canOpenStep(state, day, step) || state.steps[key]) return state;
  return recordPractice(
    touchStreak({
      ...state,
      xp: state.xp + 10,
      steps: { ...state.steps, [key]: true },
      day: step === "test" ? day + 1 : day,
    }),
  );
}

export function studiedWords(state: AppState): Word[] {
  return wordPool.filter((word) => state.cards[word.id] !== undefined);
}

export function levelFromScore(correctByLevel: Level[]): Level {
  let result: Level = "A1";
  for (const level of levels) {
    const total = placementQuestions.filter((q) => q.level === level).length;
    const correct = correctByLevel.filter((value) => value === level).length;
    if (total > 0 && correct >= Math.ceil(total / 2)) result = level;
    else break;
  }
  return result;
}

export function currentStreak(state: AppState, now = new Date()): number {
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  return state.lastActive === now.toDateString() || state.lastActive === yesterday.toDateString()
    ? state.streak
    : 0;
}
