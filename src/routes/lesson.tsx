import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { lessons } from "@/lib/content";
import {
  review,
  speak,
  STEPS,
  STEP_LABELS,
  touchStreak,
  useAppState,
  type Step,
  type AppState,
} from "@/lib/store";

import { canOpenStep, completeStep, dueWords, wordPool } from "@/lib/learning";
import { WordQuiz } from "@/components/WordQuiz";
import { SpeakingPractice } from "@/components/SpeakingPractice";

export const Route = createFileRoute("/lesson")({
  validateSearch: (search: Record<string, unknown>) => ({
    review: search["review"] === true || search["review"] === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Урок дня — SpeakUp" },
      {
        name: "description",
        content: "Повторение, новые слова, фразы, диалог, speaking и мини-тест.",
      },
      { property: "og:title", content: "Урок дня — SpeakUp" },
      { property: "og:description", content: "Ежедневный урок разговорного английского." },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { state, update, ready } = useAppState();
  const { review: reviewOnly } = Route.useSearch();
  if (!ready)
    return (
      <main className="p-8" role="status">
        Загружаем урок…
      </main>
    );
  if (!state.level)
    return (
      <main className="mx-auto max-w-xl px-6 py-16">
        <h1 className="text-3xl">Сначала выберите уровень</h1>
        <Link to="/placement" search={{ choose: true }} className="btn-primary mt-6">
          Выбрать уровень
        </Link>
      </main>
    );
  if (reviewOnly) return <ReviewSession state={state} update={update} />;
  if (state.day > lessons.length)
    return (
      <main className="mx-auto max-w-xl px-6 py-16">
        <h1 className="text-3xl">Курс завершён</h1>
        <p className="mt-4">
          Вы прошли все {lessons.length} уроков. Продолжайте повторять слова и пройдите итоговую
          проверку.
        </p>
        <Link to="/" className="btn-primary mt-6">
          На главную
        </Link>
      </main>
    );
  return <LessonSession key={state.day} state={state} update={update} />;
}

type SessionProps = { state: AppState; update: (fn: (state: AppState) => AppState) => void };

function ReviewSession({ state, update }: SessionProps) {
  const [words] = useState(() => dueWords(state));
  const nav = useNavigate();
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Link to="/" className="btn-ghost">
        На главную
      </Link>
      <h1 className="mt-6 text-3xl">Повторение слов</h1>
      <section className="card-soft mt-6 p-6">
        <WordQuiz
          words={words}
          pool={wordPool}
          onDone={() => void nav({ to: "/" })}
          onAnswer={(id, ok) =>
            update((s) =>
              touchStreak({ ...s, cards: { ...s.cards, [id]: review(s.cards[id], ok) } }),
            )
          }
        />
      </section>
    </main>
  );
}

function LessonSession({ state, update }: SessionProps) {
  const nav = useNavigate();
  const day = state.day;
  const lesson = lessons[day - 1]!;
  const [step, setStep] = useState<Step>(
    () => STEPS.find((value) => !state.steps[`${day}:${value}`]) ?? "review",
  );
  const [wi, setWi] = useState(0);
  const [showRu, setShowRu] = useState(false);
  const [rate, setRate] = useState(1);
  const [reviewWords] = useState(() => dueWords(state));
  const cur = step;
  const pool = wordPool;
  const answer = (id: string, ok: boolean) =>
    update((s) =>
      s.steps[`${day}:${cur}`]
        ? s
        : touchStreak({ ...s, cards: { ...s.cards, [id]: review(s.cards[id], ok) } }),
    );
  const complete = () => {
    const idx = STEPS.indexOf(cur);
    update((s) => completeStep(s, day, cur));
    if (idx + 1 < STEPS.length) {
      setStep(STEPS[idx + 1]!);
      setWi(0);
    } else void nav({ to: "/" });
  };

  const w = lesson.words[wi]!;

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="text-sm font-semibold text-muted-foreground">
          ✕ Выйти
        </Link>
        <span className="text-sm font-semibold">
          Урок {day} из {lessons.length} · {lesson.title}
        </span>
      </div>
      <nav aria-label="Этапы урока" className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {STEPS.map((s) => (
          <button
            key={s}
            disabled={!canOpenStep(state, day, s)}
            onClick={() => {
              setStep(s);
              setWi(0);
            }}
            className={`min-h-11 rounded-lg px-2 py-2 text-xs font-semibold disabled:opacity-40 ${s === cur ? "bg-secondary text-secondary-foreground" : state.steps[`${day}:${s}`] ? "bg-accent" : "bg-muted"}`}
            aria-current={s === cur ? "step" : undefined}
          >
            {STEP_LABELS[s]}
          </button>
        ))}
      </nav>
      <p className="mt-6 text-sm font-bold uppercase tracking-widest text-primary">
        {STEP_LABELS[cur]}
      </p>

      <section key={cur} className="card-soft mt-4 p-5 sm:p-8">
        {cur === "review" && (
          <WordQuiz words={reviewWords} pool={pool} onAnswer={answer} onDone={complete} />
        )}

        {cur === "words" && (
          <div>
            <p className="text-sm text-muted-foreground">
              {wi + 1} / {lesson.words.length}
            </p>
            <h2 className="mt-2 text-5xl font-semibold">{w.en}</h2>
            <p className="mt-1 text-muted-foreground">{w.ipa}</p>
            <p className="mt-4 text-xl font-semibold">{w.ru}</p>
            <button className="btn-ghost mt-4" onClick={() => speak(w.en)}>
              🔊 Послушать
            </button>
            <div className="mt-6 rounded-xl bg-muted p-4">
              <p className="font-semibold">{w.example}</p>
              <p className="text-sm text-muted-foreground">{w.exampleRu}</p>
            </div>
            <button
              className="btn-primary mt-6 w-full"
              onClick={() => {
                update((s) => ({
                  ...s,
                  cards: { ...s.cards, [w.id]: s.cards[w.id] ?? review(undefined, true) },
                }));
                if (wi + 1 < lesson.words.length) setWi(wi + 1);
                else complete();
              }}
            >
              Запомнил
            </button>
          </div>
        )}

        {cur === "phrases" && (
          <div>
            <h2 className="text-3xl font-semibold">Слово → фраза</h2>
            <div className="mt-6 space-y-5">
              {lesson.words.map((x) => (
                <div key={x.id}>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {x.en}
                  </p>
                  {x.phrases.map((p) => (
                    <button
                      key={p.en}
                      onClick={() => speak(p.en)}
                      className="mt-1 block w-full rounded-lg px-3 py-2 text-left hover:bg-muted"
                    >
                      <span className="font-semibold">{p.en}</span>{" "}
                      <span className="text-sm text-muted-foreground">— {p.ru}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <button className="btn-primary mt-6 w-full" onClick={complete}>
              Готово
            </button>
          </div>
        )}

        {cur === "dialogue" && (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="btn-ghost"
                onClick={() => {
                  speak(lesson.dialogue.map((d) => d.en).join(" "), rate);
                }}
              >
                ▶ Весь диалог
              </button>
              {[0.75, 1, 1.25].map((r) => (
                <button
                  key={r}
                  onClick={() => setRate(r)}
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${rate === r ? "bg-secondary text-secondary-foreground" : "bg-muted"}`}
                >
                  {r}x
                </button>
              ))}
              <button
                className="ml-auto text-sm font-semibold underline"
                onClick={() => setShowRu(!showRu)}
              >
                {showRu ? "Скрыть перевод" : "Перевод"}
              </button>
            </div>
            <div className="mt-6 space-y-3">
              {lesson.dialogue.map((d, k) => (
                <button
                  key={k}
                  onClick={() => speak(d.en, rate)}
                  className={`block max-w-[85%] rounded-2xl px-4 py-3 text-left ${d.who === "A" ? "bg-muted" : "ml-auto bg-secondary text-secondary-foreground"}`}
                >
                  <p className="font-semibold">{d.en}</p>
                  {showRu && <p className="text-sm opacity-70">{d.ru}</p>}
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-accent p-4 text-accent-foreground">
              <p className="font-bold">{lesson.grammar.title}</p>
              <p className="text-sm">{lesson.grammar.rule}</p>
              <ul className="mt-3 space-y-1">
                {lesson.grammar.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </div>
            <button className="btn-primary mt-6 w-full" onClick={complete}>
              Готово
            </button>
          </div>
        )}

        {cur === "speaking" && <SpeakingPractice items={lesson.speaking} onDone={complete} />}

        {cur === "test" && (
          <WordQuiz
            requirePass
            words={lesson.words}
            pool={pool}
            onAnswer={answer}
            onDone={complete}
          />
        )}
      </section>
    </main>
  );
}
