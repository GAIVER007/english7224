import { grammarTasks, type GrammarTask } from "./free-trainer";
import { review, type CardState } from "./store";

const tasks = grammarTasks();
export function grammarReview(cards: Record<string, CardState>, now = Date.now()): GrammarTask[] {
  return tasks
    .filter((task) => cards[task.id] && cards[task.id]!.due <= now)
    .sort((a, b) => cards[a.id]!.due - cards[b.id]!.due || cards[a.id]!.box - cards[b.id]!.box)
    .slice(0, 10);
}
export function grammarTopicProgress(
  cards: Record<string, CardState>,
  tense: string,
  form: string,
) {
  const topic = tasks.filter((task) => task.tense === tense && task.form === form);
  return {
    total: topic.length,
    practiced: topic.filter((task) => !!cards[task.id]).length,
    reinforced: topic.filter((task) => (cards[task.id]?.box ?? 0) >= 2).length,
  };
}

export function grammarTheory(tense: string, form: string): string {
  const meaning =
    tense === "present"
      ? "Обычные действия и привычки."
      : tense === "past"
        ? "Завершённые действия в прошлом."
        : "Прогнозы и решения о будущем.";
  const rules: Record<string, Record<string, string>> = {
    present: {
      positive:
        "С he/she глагол получает -s или -es; с we/they используется начальная форма. He works. They work.",
      negative:
        "He/she + does not + начальная форма; we/they + do not + начальная форма. Окончание -s у основного глагола исчезает.",
      question:
        "Does + he/she + начальная форма? Do + we/they + начальная форма? Вспомогательный глагол стоит первым.",
    },
    past: {
      positive:
        "Подлежащее + прошедшая форма глагола. У правильных глаголов — -ed; неправильные формы нужно запомнить.",
      negative:
        "Подлежащее + did not + начальная форма. После did не добавляй -ed и не используй прошедшую форму.",
      question: "Did + подлежащее + начальная форма? Прошедшее время выражено словом did.",
    },
    future: {
      positive: "Подлежащее + will + начальная форма. После will глагол не меняется.",
      negative: "Подлежащее + will not + начальная форма. Сокращение will not — won't.",
      question: "Will + подлежащее + начальная форма? Will переносится перед подлежащим.",
    },
  };
  return `${meaning} ${rules[tense]?.[form] ?? ""}`.trim();
}

/** Repeating a phrase immediately cannot count as spaced reinforcement. */
export function reviewGrammar(
  card: CardState | undefined,
  correct: boolean,
  now = Date.now(),
): CardState {
  const next = review(card, correct, now);
  return correct && card && card.due > now ? { ...next, box: card.box, due: card.due } : next;
}
