import type { AppState } from "./store";

export interface CourseModule {
  id: number;
  title: string;
  description: string;
  startDay: number;
  endDay: number;
}

export const courseModules: CourseModule[] = [
  {
    id: 1,
    title: "Первые разговоры",
    description: "Знакомство, простые вопросы и уверенный старт разговора.",
    startDay: 1,
    endDay: 5,
  },
  {
    id: 2,
    title: "Каждый день",
    description: "Повседневные дела, покупки, дорога и общение в городе.",
    startDay: 6,
    endDay: 10,
  },
  {
    id: 3,
    title: "Личные истории",
    description: "Прошлый опыт, воспоминания и рассказы о себе.",
    startDay: 11,
    endDay: 15,
  },
  {
    id: 4,
    title: "Планы и решения",
    description: "Будущее, выбор, договорённости и решение проблем.",
    startDay: 16,
    endDay: 20,
  },
  {
    id: 5,
    title: "Мнения и общение",
    description: "Аргументы, эмоции, согласие и уважительное несогласие.",
    startDay: 21,
    endDay: 25,
  },
  {
    id: 6,
    title: "Работа и мир",
    description: "Рабочие ситуации, новости, путешествия и общение без сценария.",
    startDay: 26,
    endDay: 30,
  },
];

export function lessonExamKey(day: number): string {
  return `lesson:${day}`;
}

export function moduleExamKey(moduleId: number): string {
  return `module:${moduleId}`;
}

export function pendingModule(state: AppState): CourseModule | undefined {
  return courseModules.find(
    (module) => module.endDay < state.day && !state.examResults?.[moduleExamKey(module.id)]?.passed,
  );
}

export function moduleAvailable(state: AppState, moduleId: number): boolean {
  const module = courseModules.find((candidate) => candidate.id === moduleId);
  return (
    module !== undefined &&
    state.day > module.endDay &&
    (state.examResults?.[moduleExamKey(moduleId)]?.passed === true ||
      pendingModule(state)?.id === moduleId)
  );
}
