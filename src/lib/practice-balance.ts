import type { AppState } from "./store";
import { weeklyActivity } from "./motivation";

export const PRACTICE_SKILLS = ["language", "input", "output", "fluency"] as const;
export type PracticeSkill = (typeof PRACTICE_SKILLS)[number];
export const SKILL_LABELS: Record<PracticeSkill, string> = {
  language: "Слова и фразы",
  input: "Понимание",
  output: "Своя речь",
  fluency: "Беглость",
};
export function practiceBalance(state: AppState, now: number | Date = Date.now()) {
  const days = weeklyActivity(state, now);
  const skills = new Set(days.flatMap((day) => state.practiceSkills?.[day.date] ?? []));
  return {
    days,
    activeDays: days.filter((day) => day.count > 0).length,
    skills: PRACTICE_SKILLS.filter((skill) => skills.has(skill)),
  };
}
