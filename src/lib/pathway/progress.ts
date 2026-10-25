import { awardXp } from "../xp-ledger";
import { recordPractice } from "../motivation";
import { touchStreak, type AppState } from "../store";
import { emptyPath, emptyUnit, examBankVersion, type PathUnitProgress } from "./state";
import { levelQuestions, unitsForLevel } from "./index";
import type { PathLevel, PathUnit } from "./types";
export function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
export function productionReady(unit: PathUnit, progress: PathUnitProgress) {
  return (
    wordCount(progress.writing) >= unit.writing.minWords &&
    progress.writingChecks.every(Boolean) &&
    progress.speakingChecks.every(Boolean)
  );
}
export function saveUnit(state: AppState, id: string, patch: Partial<PathUnitProgress>): AppState {
  const path = state.pathway ?? emptyPath();
  return {
    ...state,
    pathway: {
      ...path,
      units: { ...path.units, [id]: { ...(path.units[id] ?? emptyUnit()), ...patch } },
    },
  };
}
export function submitUnit(state: AppState, unit: PathUnit, now = Date.now()): AppState {
  const path = state.pathway ?? emptyPath();
  const progress = path.units[unit.id] ?? emptyUnit();
  if (
    progress.submitted ||
    !productionReady(unit, progress) ||
    unit.questions.some((_, i) => !progress.answers[String(i)])
  )
    return state;
  const correct = unit.questions.filter((q, i) => q.answer === progress.answers[String(i)]).length;
  const passed = correct / unit.questions.length >= 0.8;
  const rewarded = passed && !progress.passed ? awardXp(state, `unit:${unit.id}`) : state;
  const next = saveUnit(rewarded, unit.id, {
    submitted: true,
    passed: progress.passed || passed,
    best: Math.max(progress.best, correct),
    attempts: progress.attempts + 1,
    due: passed ? now + 7 * 86400000 : now,
  });
  next.pathway = {
    ...next.pathway!,
    history: [
      ...path.history,
      { id: unit.id, at: now, correct, total: unit.questions.length, passed },
    ],
  };
  let practiced = recordPractice(touchStreak(next, now), now, "language");
  practiced = recordPractice(practiced, now, "input");
  return recordPractice(practiced, now, "output");
}
export function canTakeLevel(state: AppState, level: PathLevel) {
  return (
    unitsForLevel(level).length > 0 &&
    unitsForLevel(level).every((u) => state.pathway?.units[u.id]?.passed)
  );
}
export function submitLevel(state: AppState, level: PathLevel, now = Date.now()): AppState {
  const path = state.pathway ?? emptyPath();
  const exam = path.exams[level];
  const questions = levelQuestions(level, examBankVersion(exam));
  if (
    !exam ||
    exam.submitted ||
    !canTakeLevel(state, level) ||
    questions.some((q) => !exam.answers[q.id])
  )
    return state;
  const correct = questions.filter((q) => exam.answers[q.id] === q.answer).length;
  const passed = correct / questions.length >= 0.8;
  return recordPractice(
    touchStreak(
      {
        ...(passed && !exam.passed ? awardXp(state, `exam:${level}`) : state),
        pathway: {
          ...path,
          exams: {
            ...path.exams,
            [level]: {
              ...exam,
              submitted: true,
              passed: exam.passed || passed,
              best: Math.max(exam.best, correct),
              attempts: exam.attempts + 1,
            },
          },
          history: [
            ...path.history,
            {
              id: `exam:${level}`,
              at: now,
              correct,
              total: questions.length,
              passed,
              examVersion: examBankVersion(exam),
              reviewUnitIds: [
                ...new Set(
                  questions.filter((q) => exam.answers[q.id] !== q.answer).map((q) => q.unitId),
                ),
              ],
            },
          ],
        },
      },
      now,
    ),
    now,
    "language",
  );
}

/** Keep an in-progress exam pinned; rotate variants only after a submitted attempt. */
export function startNextLevelAttempt(state: AppState, level: PathLevel): AppState {
  const path = state.pathway ?? emptyPath();
  const exam = path.exams[level];
  if (!exam?.submitted) return state;
  return {
    ...state,
    pathway: {
      ...path,
      exams: {
        ...path.exams,
        [level]: {
          ...exam,
          version: examBankVersion(exam) === 2 ? 3 : 2,
          answers: {},
          submitted: false,
        },
      },
    },
  };
}
