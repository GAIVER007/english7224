import { lessons } from "./content";
import { courseModules, moduleExamKey } from "./curriculum";
import type { AppState } from "./store";

const LEAGUES = [
  { title: "Старт", minimum: 0 },
  { title: "Бронза", minimum: 100 },
  { title: "Серебро", minimum: 300 },
  { title: "Золото", minimum: 700 },
  { title: "Платина", minimum: 1200 },
  { title: "Алмаз", minimum: 1800 },
];

/** Calendar arithmetic uses UTC to avoid DST changing the distance between dates. */
export function practiceRecords(state: AppState) {
  const dates = Object.entries(state.activity ?? {})
    .filter(([, count]) => count > 0)
    .map(([date]) => date)
    .sort();
  let bestStreak = 0;
  let run = 0;
  let previous = -Infinity;
  for (const date of dates) {
    const day = Date.parse(`${date}T00:00:00Z`) / 86400000;
    run = day === previous + 1 ? run + 1 : 1;
    bestStreak = Math.max(bestStreak, run);
    previous = day;
  }
  return { activeDays: dates.length, bestStreak: Math.max(bestStreak, state.streak) };
}

export function personalRating(state: AppState) {
  const records = practiceRecords(state);
  const missions = lessons.filter((lesson) => state.steps[`${lesson.day}:test`]).length;
  const speaking = lessons.filter((lesson) => state.steps[`${lesson.day}:speaking`]).length;
  const modules = courseModules.filter(
    (module) => state.examResults?.[moduleExamKey(module.id)]?.passed,
  ).length;
  const parts = [
    {
      label: "Темы A0–C1",
      count: Object.values(state.pathway?.units ?? {}).filter((u) => u.passed).length,
      limit: 72,
      unit: 20,
    },
    {
      label: "Контрольные A0–C1",
      count: Object.values(state.pathway?.exams ?? {}).filter((e) => e.passed).length,
      limit: 6,
      unit: 50,
    },
    { label: "Пройденные миссии", count: missions, limit: lessons.length, unit: 20 },
    { label: "Сданные модули", count: modules, limit: courseModules.length, unit: 50 },
    { label: "Дни практики", count: Math.min(records.activeDays, 100), limit: 100, unit: 10 },
    { label: "Речевые этапы", count: speaking, limit: lessons.length, unit: 5 },
  ];
  const score = parts.reduce((sum, part) => sum + part.count * part.unit, 0);
  const index = LEAGUES.filter((league) => score >= league.minimum).length - 1;
  const league = LEAGUES[index]!;
  const next = LEAGUES[index + 1];
  const percent = next
    ? Math.floor(((score - league.minimum) / (next.minimum - league.minimum)) * 100)
    : 100;
  return { score, league, next, percent, parts, records, modules, speaking };
}
