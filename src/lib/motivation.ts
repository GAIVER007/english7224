import type { AppState, DailyGoal } from "./store";
import { personalRating } from "./rating";

const DEFAULT_DAILY_GOAL: DailyGoal = 5;

export interface DailyProgress {
  count: number;
  goal: DailyGoal;
  percent: number;
  completed: boolean;
}

export interface ActivityDay {
  date: string;
  label: string;
  count: number;
  isToday: boolean;
}

export interface LearnerRank {
  level: number;
  title: string;
  currentXp: number;
  neededXp: number;
  percent: number;
}

export interface MotivationBadge {
  id: BadgeId;
  title: string;
  description: string;
  earned: boolean;
}

export const BADGE_IDS = [
  "first-lesson",
  "five-lessons",
  "ten-words",
  "ten-mastered",
  "streak-3",
  "streak-7",
  "first-module",
  "all-modules",
  "speaking-10",
  "practice-30",
] as const;
export type BadgeId = (typeof BADGE_IDS)[number];

function asDate(now: number | Date): Date {
  return now instanceof Date ? new Date(now.getTime()) : new Date(now);
}

/** Calendar date in the learner's local timezone. */
export function localDateKey(now: number | Date = Date.now()): string {
  const date = asDate(now);
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Records one meaningful practice action. Callers decide what counts as one action. */
export function recordPractice(state: AppState, now: number | Date = Date.now()): AppState {
  const date = localDateKey(now);
  const activity = state.activity ?? {};
  return {
    ...state,
    activity: { ...activity, [date]: (activity[date] ?? 0) + 1 },
  };
}

export function dailyProgress(state: AppState, now: number | Date = Date.now()): DailyProgress {
  const goal = state.dailyGoal ?? DEFAULT_DAILY_GOAL;
  const count = state.activity?.[localDateKey(now)] ?? 0;
  return {
    count,
    goal,
    percent: Math.min(100, Math.round((count / goal) * 100)),
    completed: count >= goal,
  };
}

export function weeklyActivity(state: AppState, now: number | Date = Date.now()): ActivityDay[] {
  const today = asDate(now);
  const todayKey = localDateKey(today);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (6 - index));
    const key = localDateKey(date);
    return {
      date: key,
      label: new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(date),
      count: state.activity?.[key] ?? 0,
      isToday: key === todayKey,
    };
  });
}

const RANKS = [
  { minimum: 0, title: "Новичок" },
  { minimum: 60, title: "Исследователь" },
  { minimum: 120, title: "Практик" },
  { minimum: 180, title: "Знаток" },
  { minimum: 300, title: "Мастер привычки" },
] as const;

/** A motivational game rank. It is intentionally unrelated to CEFR language levels. */
export function learnerRank(xp: number): LearnerRank {
  const currentXp = Math.max(0, Math.floor(xp));
  let rankIndex = 0;
  for (let index = 1; index < RANKS.length; index++) {
    if (currentXp < RANKS[index]!.minimum) break;
    rankIndex = index;
  }
  const rank = RANKS[rankIndex]!;
  const next = RANKS[rankIndex + 1];
  const neededXp = next?.minimum ?? rank.minimum;
  const percent = next
    ? Math.min(100, Math.round(((currentXp - rank.minimum) / (next.minimum - rank.minimum)) * 100))
    : 100;
  return { level: rankIndex + 1, title: rank.title, currentXp, neededXp, percent };
}

function badgesFromProgress(state: AppState): MotivationBadge[] {
  const completedLessons = Object.entries(state.steps).filter(
    ([key, completed]) => completed && /^\d+:test$/.test(key),
  ).length;
  const cards = Object.values(state.cards);
  const masteredCards = cards.filter((card) => card.box >= 2).length;
  const rating = personalRating(state);

  return [
    {
      id: "first-module",
      title: "Первый рубеж",
      description: "Сдать экзамен одного модуля",
      earned: rating.modules >= 1,
    },
    {
      id: "all-modules",
      title: "Маршрут пройден",
      description: "Сдать все 6 экзаменов модулей",
      earned: rating.modules >= 6,
    },
    {
      id: "speaking-10",
      title: "Говорю чаще",
      description: "Пройти речевые этапы 10 разных миссий",
      earned: rating.speaking >= 10,
    },
    {
      id: "practice-30",
      title: "Английский в жизни",
      description: "Заниматься 30 дней, необязательно подряд",
      earned: rating.records.activeDays >= 30,
    },
    {
      id: "first-lesson",
      title: "Первый урок",
      description: "Завершить первый урок",
      earned: completedLessons >= 1,
    },
    {
      id: "five-lessons",
      title: "Учебный ритм",
      description: "Завершить 5 уроков",
      earned: completedLessons >= 5,
    },
    {
      id: "ten-words",
      title: "Коллекционер слов",
      description: "Добавить в практику 10 слов",
      earned: cards.length >= 10,
    },
    {
      id: "ten-mastered",
      title: "Крепкая память",
      description: "Закрепить 10 слов",
      earned: masteredCards >= 10,
    },
    {
      id: "streak-3",
      title: "Три дня подряд",
      description: "Заниматься 3 дня подряд",
      earned: state.streak >= 3,
    },
    {
      id: "streak-7",
      title: "Неделя практики",
      description: "Заниматься 7 дней подряд",
      earned: state.streak >= 7,
    },
  ];
}

export function earnedBadgeIdsForState(state: AppState): BadgeId[] {
  const previouslyEarned = new Set(state.earnedBadgeIds ?? []);
  return badgesFromProgress(state)
    .filter((badge) => badge.earned || previouslyEarned.has(badge.id))
    .map((badge) => badge.id);
}

export function earnedBadges(state: AppState): MotivationBadge[] {
  const earned = new Set(earnedBadgeIdsForState(state));
  return badgesFromProgress(state).map((badge) => ({ ...badge, earned: earned.has(badge.id) }));
}
