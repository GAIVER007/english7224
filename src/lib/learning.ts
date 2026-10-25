import { awardXp } from "./xp-ledger";
import { lessons, placementQuestions, levels, type Level, type Word } from "./content";
import { lessonExamKey, moduleAvailable, moduleExamKey, pendingModule } from "./curriculum";
import { recordPractice } from "./motivation";
import { STEPS, touchStreak, type AppState, type Step } from "./store";

export const wordPool = lessons.flatMap((lesson) => lesson.words);
export const PASS_PERCENT = 70;
export const EXAM_PASS_PERCENT = 80;
const LESSON_EXAM_TOTAL = 7;
const MODULE_EXAM_TOTAL = 15;

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
    pendingModule(state) === undefined &&
    day === state.day &&
    STEPS.slice(0, STEPS.indexOf(step)).every((s) => state.steps[`${day}:${s}`])
  );
}

export function completeStep(state: AppState, day: number, step: Step): AppState {
  const key = `${day}:${step}`;
  if (
    day > lessons.length ||
    !canOpenStep(state, day, step) ||
    state.steps[key] ||
    (step === "test" && !state.examResults?.[lessonExamKey(day)]?.passed)
  )
    return state;
  return recordPractice(
    touchStreak({
      ...awardXp(state, `step:${key}`),
      steps: { ...state.steps, [key]: true },
      day: step === "test" ? day + 1 : day,
    }),
    Date.now(),
    step === "dialogue" ? "input" : step === "speaking" ? "output" : "language",
  );
}

interface ExamScore {
  correct: number;
  total: number;
}

function validScore(score: ExamScore, expectedTotal: number): boolean {
  return (
    Number.isInteger(score.correct) &&
    Number.isInteger(score.total) &&
    score.total === expectedTotal &&
    score.correct >= 0 &&
    score.correct <= score.total
  );
}

function passedExam(score: ExamScore): boolean {
  return score.correct * 100 >= score.total * EXAM_PASS_PERCENT;
}

export function finishLessonExam(state: AppState, day: number, score: ExamScore): AppState {
  const prerequisites = STEPS.slice(0, STEPS.indexOf("test"));
  if (
    !validScore(score, LESSON_EXAM_TOTAL) ||
    day !== state.day ||
    day < 1 ||
    day > lessons.length ||
    pendingModule(state) !== undefined ||
    !prerequisites.every((step) => state.steps[`${day}:${step}`])
  )
    return state;

  const passed = passedExam(score);
  const completedAt = Date.now();
  const withResult: AppState = {
    ...state,
    resultHistory: [
      ...(state.resultHistory ?? []),
      { kind: "lesson", number: day, ...score, completedAt },
    ],
    examResults: {
      ...(state.examResults ?? {}),
      [lessonExamKey(day)]: { ...score, completedAt, passed },
    },
  };
  return passed ? completeStep(withResult, day, "test") : withResult;
}

export function finishModuleExam(state: AppState, moduleId: number, score: ExamScore): AppState {
  if (!validScore(score, MODULE_EXAM_TOTAL) || !moduleAvailable(state, moduleId)) return state;

  const key = moduleExamKey(moduleId);
  const previous = state.examResults?.[key];
  const passed = passedExam(score);
  const completedAt = Date.now();
  const resultHistory: NonNullable<AppState["resultHistory"]> = [
    ...(state.resultHistory ?? []),
    { kind: "module", number: moduleId, ...score, completedAt },
  ];
  if (previous?.passed && !passed) return { ...state, resultHistory };

  const next: AppState = {
    ...(passed && !previous?.passed ? awardXp(state, key) : state),
    resultHistory,
    examResults: {
      ...(state.examResults ?? {}),
      [key]: { ...score, completedAt, passed },
    },
  };
  return passed && !previous?.passed ? recordPractice(touchStreak(next)) : next;
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
