import { createFileRoute, Link } from "@tanstack/react-router";
import { lessons } from "@/lib/content";
import { STEPS, STEP_LABELS, useAppState } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SpeakUp — разговорный английский каждый день" },
      { name: "description", content: "Слово → фраза → диалог → практика. Ежедневные уроки разговорного английского с повторением." },
      { property: "og:title", content: "SpeakUp — разговорный английский" },
      { property: "og:description", content: "Ежедневные 20-минутные уроки: слова, фразы, диалоги, speaking." },
    ],
  }),
  component: Home,
});

function Home() {
  const { state, ready } = useAppState();
  if (!ready) return null;

  if (!state.level) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">SpeakUp</p>
        <h1 className="text-5xl font-semibold leading-tight md:text-6xl">Не учите слова.<br />Учитесь <em className="text-primary">говорить</em>.</h1>
        <p className="mt-6 text-lg text-muted-foreground">Слово → фраза → ситуация → диалог → практика → повторение. 20 минут в день.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/placement" search={{ choose: undefined }} className="btn-primary">Пройти тест уровня</Link>
          <Link to="/placement" search={{ choose: true }} className="btn-ghost">Выбрать уровень сам</Link>
        </div>
      </main>
    );
  }

  const lesson = lessons[(state.day - 1) % lessons.length]!;
  const done = STEPS.filter((s) => state.steps[`${state.day}:${s}`]).length;
  const pct = Math.round((done / STEPS.length) * 100);
  const due = Object.values(state.cards).filter((c) => c.due <= Date.now()).length;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="flex items-center justify-between">
        <span className="font-display text-xl font-semibold">SpeakUp</span>
        <div className="flex gap-4 text-sm font-semibold">
          <span>🔥 {state.streak}</span><span>⭐ {state.xp} XP</span>
          <span className="rounded-full bg-secondary px-3 py-0.5 text-secondary-foreground">{state.level}</span>
          <Link to="/progress" className="underline-offset-4 hover:underline">Прогресс</Link>
        </div>
      </header>

      <section className="card-soft mt-10 p-8">
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Сегодня · Day {state.day}</p>
        <h1 className="mt-2 text-4xl font-semibold">{lesson.title}</h1>
        <p className="text-muted-foreground">{lesson.titleRu}</p>
        <div className="mt-6 h-3 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-sm font-semibold">Прогресс дня: {pct}%</p>
        <ul className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium">
              <span className={`h-2.5 w-2.5 rounded-full ${state.steps[`${state.day}:${s}`] ? "bg-success" : "bg-border"}`} />
              {STEP_LABELS[s]}
            </li>
          ))}
        </ul>
        <Link to="/lesson" className="btn-primary mt-8 w-full">{pct === 100 ? "Повторить урок" : "Continue Learning"}</Link>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="card-soft p-6">
          <p className="text-sm text-muted-foreground">К повторению</p>
          <p className="font-display text-3xl font-semibold">{due} карточек</p>
        </div>
        <div className="card-soft p-6">
          <p className="text-sm text-muted-foreground">Грамматика дня</p>
          <p className="font-display text-2xl font-semibold">{lesson.grammar.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{lesson.grammar.rule}</p>
        </div>
      </section>
    </main>
  );
}
