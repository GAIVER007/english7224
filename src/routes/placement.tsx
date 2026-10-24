import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { levels, placementQuestions, type Level } from "@/lib/content";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/placement")({
  validateSearch: (s: Record<string, unknown>) => ({ choose: s.choose === true || s.choose === "true" ? true : undefined }),
  head: () => ({
    meta: [
      { title: "Тест уровня — SpeakUp" },
      { name: "description", content: "Определите свой уровень английского от A1 до C1 за пару минут." },
      { property: "og:title", content: "Тест уровня английского — SpeakUp" },
      { property: "og:description", content: "Короткий placement test от A1 до C1." },
    ],
  }),
  component: Placement,
});

export function levelFromScore(correctByLevel: Level[]): Level {
  let lvl: Level = "A1";
  for (const l of levels) {
    const total = placementQuestions.filter((q) => q.level === l).length;
    const ok = correctByLevel.filter((c) => c === l).length;
    if (ok >= Math.ceil(total / 2)) lvl = l; else break;
  }
  return lvl;
}

function Placement() {
  const { choose } = Route.useSearch();
  const { update } = useAppState();
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState<Level[]>([]);
  const [result, setResult] = useState<Level | null>(null);

  const finish = (lvl: Level) => {
    update((s) => ({ ...s, level: lvl }));
    nav({ to: "/" });
  };

  if (choose) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16">
        <h1 className="text-4xl font-semibold">Выберите уровень</h1>
        <div className="mt-8 grid gap-3">
          {levels.map((l) => (
            <button key={l} className="option" onClick={() => finish(l)}>{l}</button>
          ))}
        </div>
      </main>
    );
  }

  if (result) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16 text-center">
        <p className="text-muted-foreground">Ваш примерный уровень</p>
        <h1 className="mt-2 text-8xl font-semibold text-primary">{result}</h1>
        <button className="btn-primary mt-10" onClick={() => finish(result)}>Начать обучение</button>
      </main>
    );
  }

  const q = placementQuestions[i];
  const answer = (idx: number) => {
    const next = idx === q.answer ? [...correct, q.level] : correct;
    setCorrect(next);
    if (i + 1 < placementQuestions.length) setI(i + 1);
    else setResult(levelFromScore(next));
  };

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <p className="text-sm font-semibold text-muted-foreground">Вопрос {i + 1} из {placementQuestions.length}</p>
      <h1 className="mt-4 text-3xl font-semibold">{q.q}</h1>
      <div className="mt-8 grid gap-3">
        {q.options.map((o, idx) => <button key={o} className="option" onClick={() => answer(idx)}>{o}</button>)}
      </div>
    </main>
  );
}
