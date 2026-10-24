import { lessons } from "./content";
import { pendingModule } from "./curriculum";
import { dueWords } from "./learning";
import { mistakeWords } from "./mistakes";
import { STEPS, type AppState } from "./store";

export interface StudyAction {
  id: string;
  title: string;
  reason: string;
  label: string;
  search: {
    module?: number;
    review?: boolean;
    mistakes?: boolean;
    free?: boolean;
    training?: boolean;
  };
}

/** Resume first; never hide the course behind an endless review queue. */
export function studyPlan(state: AppState, now = Date.now()): StudyAction[] {
  const actions: StudyAction[] = [];
  const pending = pendingModule(state);
  const lesson = lessons[state.day - 1];
  const completed = STEPS.filter((step) => state.steps[`${state.day}:${step}`]).length;
  const course: StudyAction | undefined = pending
    ? {
        id: "module",
        title: `Экзамен: ${pending.title}`,
        reason: "Следующий модуль откроется после результата 80%.",
        label: "Пройти экзамен",
        search: { module: pending.id },
      }
    : lesson
      ? {
          id: "lesson",
          title: lesson.titleRu,
          reason: completed
            ? `Уже пройдено ${completed} из ${STEPS.length} этапов. Продолжим с места остановки.`
            : `Миссия ${state.day} из ${lessons.length} · слова, диалог и речь.`,
          label: completed ? "Продолжить урок" : "Начать урок",
          search: {},
        }
      : undefined;
  if (course && (pending || completed > 0)) actions.push(course);
  const due = dueWords(state, now).length;
  if (due)
    actions.push({
      id: "review",
      title: "Освежить слова",
      reason: `Подошло время повторения: ${due}.`,
      label: "Повторить слова",
      search: { review: true },
    });
  if (course && !actions.includes(course)) actions.push(course);
  const mistakes = mistakeWords(state);
  if (mistakes.length)
    actions.push({
      id: "mistakes",
      title: "Разобрать трудные слова",
      reason: `Слов с ошибками в короткой подборке: ${mistakes.length}.`,
      label: "Закрепить ошибки",
      search: { mistakes: true },
    });
  const recent = (state.grammarHistory ?? []).slice(-20);
  const needsGrammar = recent.length >= 10 && recent.filter(Boolean).length / recent.length < 0.8;
  actions.push(
    needsGrammar
      ? {
          id: "grammar",
          title: "Укрепить грамматику",
          reason: `Верно ${recent.filter(Boolean).length} из ${recent.length} последних ответов. Потренируем построение фраз.`,
          label: "Собрать предложения",
          search: { free: true },
        }
      : {
          id: "practice",
          title: state.day > 1 ? "Поговорить вслух" : "Собрать первые фразы",
          reason:
            state.day > 1
              ? "Примени знакомые слова в диалоге и пересказе."
              : "Короткая практика простых времён.",
          label: "Начать практику",
          search: state.day > 1 ? { training: true } : { free: true },
        },
  );
  return actions.slice(0, 3);
}
