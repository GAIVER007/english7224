import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { TrainingHeader, Brand } from "@/components/TrainingUI";
import { ArrowRight, Sprout } from "lucide-react";
import { useState } from "react";
import { levels, placementQuestions, type Level } from "@/lib/content";
import { levelFromScore } from "@/lib/learning";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/placement")({
  validateSearch: (s: Record<string, unknown>) => ({
    choose: s["choose"] === true || s["choose"] === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Тест уровня — SpeakUp" },
      {
        name: "description",
        content: "Определите свой уровень английского от A1 до C1 за пару минут.",
      },
      { property: "og:title", content: "Тест уровня английского — SpeakUp" },
      { property: "og:description", content: "Короткий placement test от A1 до C1." },
    ],
  }),
  component: Placement,
});

function Placement() {
  const { choose } = Route.useSearch();
  const { update, ready } = useAppState();
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState<Level[]>([]);
  const [result, setResult] = useState<Level | null>(null);

  const finish = (lvl: Level) => {
    update((s) => ({ ...s, level: lvl }));
    nav({ to: "/" });
  };

  if (!ready)
    return (
      <main className="p-8" role="status">
        Загружаем профиль…
      </main>
    );

  if (choose) {
    return (
      <main className="app-shell focus-shell">
        <TrainingHeader title="Твоя точка старта" detail="Её всегда можно изменить" />
        <h1 className="text-4xl font-semibold">Выбери свой уровень</h1>
        <p className="mt-4 text-muted-foreground">
          Как ты чувствуешь себя в английском? Это ориентир для тебя. Пока тренируемся на пяти
          жизненных ситуациях уровня A2.
        </p>
        <div className="mt-8 grid gap-3">
          {levels.map((l) => (
            <button key={l} className="option" onClick={() => finish(l)}>
              <span className="inline-flex min-w-12 text-primary">{l}</span>
              <span>
                {
                  {
                    A1: "Начинаю с основ",
                    A2: "Понимаю простые фразы",
                    B1: "Могу поддержать разговор",
                    B2: "Общаюсь довольно свободно",
                    C1: "Хочу говорить точнее",
                  }[l]
                }
              </span>
            </button>
          ))}
        </div>
      </main>
    );
  }

  if (result) {
    return (
      <main className="app-shell focus-shell text-center">
        <div className="result-medallion">
          <Sprout size={36} aria-hidden="true" />
        </div>
        <p className="eyebrow">Твоя точка старта</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Это короткий ориентировочный тест, не полноценная оценка CEFR. Доступный курс — A2.
        </p>
        <h1 className="mt-2 text-8xl font-semibold text-primary">{result}</h1>
        <button className="btn-primary mt-10" onClick={() => finish(result)}>
          Начать обучение
        </button>
      </main>
    );
  }

  const q = placementQuestions[i]!;
  const answer = (idx: number) => {
    const next = idx === q.answer ? [...correct, q.level] : correct;
    setCorrect(next);
    if (i + 1 < placementQuestions.length) setI(i + 1);
    else setResult(levelFromScore(next));
  };

  return (
    <main className="app-shell focus-shell">
      <TrainingHeader title="Найдём точку старта" detail="Без оценок и давления" />
      <p className="mb-4 text-sm text-muted-foreground">
        9 вопросов помогут выбрать ориентир. Результат можно изменить в профиле.
      </p>
      <div className="meter mb-6">
        <span style={{ width: `${(i / placementQuestions.length) * 100}%` }} />
      </div>
      <p className="eyebrow">
        Вопрос {i + 1} из {placementQuestions.length}
      </p>
      <h1 className="mt-4 text-3xl font-semibold">{q.q}</h1>
      <div className="mt-8 grid gap-3">
        {q.options.map((o, idx) => (
          <button key={o} className="option" onClick={() => answer(idx)}>
            {o}
          </button>
        ))}
      </div>
    </main>
  );
}
