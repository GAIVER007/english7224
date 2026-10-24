import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { review, speak, touchStreak, useAppState, type AppState } from "@/lib/store";
import { studiedWords } from "@/lib/learning";
import { AREA_LABELS, createExam, replaceAudioQuestion, type Area } from "@/lib/exam";

export const Route = createFileRoute("/weekly")({
  head: () => ({
    meta: [
      { title: "Проверка изученного — SpeakUp" },
      {
        name: "description",
        content: "Проверка изученных слов, фраз и аудирования с разбором ошибок.",
      },
    ],
  }),
  component: Weekly,
});

function Weekly() {
  const { state, update, ready } = useAppState();
  if (!ready)
    return (
      <main className="p-8" role="status">
        Готовим проверку…
      </main>
    );
  if (!state.level || studiedWords(state).length === 0)
    return (
      <main className="mx-auto max-w-xl px-6 py-16">
        <h1 className="text-3xl">Сначала изучите новые слова</h1>
        <p className="mt-4 text-muted-foreground">
          В проверку попадёт только материал, с которым вы уже работали.
        </p>
        <Link to="/" className="btn-primary mt-6">
          К урокам
        </Link>
      </main>
    );
  return <ExamSession state={state} update={update} />;
}

function ExamSession({
  state,
  update,
}: {
  state: AppState;
  update: (fn: (state: AppState) => AppState) => void;
}) {
  const [audioAvailable, setAudioAvailable] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
  );
  const [questions, setQuestions] = useState(() => createExam(studiedWords(state), audioAvailable));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState<Record<Area, { correct: number; total: number }>>({
    Vocabulary: { correct: 0, total: 0 },
    Phrases: { correct: 0, total: 0 },
    Listening: { correct: 0, total: 0 },
  });
  const [picked, setPicked] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const answered = useRef(false);
  const saved = useRef(false);

  useEffect(() => {
    const handleAudioError = () => {
      setAudioAvailable(false);
      setQuestions((previous) =>
        previous.map((question, questionIndex) =>
          questionIndex > index || (questionIndex === index && picked === null)
            ? replaceAudioQuestion(question)
            : question,
        ),
      );
    };
    window.addEventListener("speakup-audio-error", handleAudioError);
    return () => window.removeEventListener("speakup-audio-error", handleAudioError);
  }, [index, picked]);

  if (index >= questions.length) {
    const totalCorrect = Object.values(score).reduce((sum, area) => sum + area.correct, 0);
    return (
      <main className="mx-auto max-w-xl px-5 py-10">
        <h1 className="text-4xl font-semibold">Результат проверки</h1>
        <p className="mt-4 text-2xl">
          {totalCorrect} из {questions.length} ·{" "}
          {Math.round((totalCorrect / questions.length) * 100)}%
        </p>
        <section className="card-soft mt-6 space-y-3 p-6">
          {(Object.keys(score) as Area[])
            .filter((area) => score[area].total > 0)
            .map((area) => (
              <p key={area} className="flex justify-between gap-3">
                <span>{AREA_LABELS[area]}</span>
                <span>
                  {score[area].correct} / {score[area].total}
                </span>
              </p>
            ))}
        </section>
        {mistakes.length > 0 ? (
          <section className="mt-6">
            <h2 className="text-2xl">Что повторить</h2>
            <ul className="mt-3 space-y-2">
              {mistakes.map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Карточки с ошибками уже доступны в повторении.
            </p>
          </section>
        ) : (
          <p className="mt-6">Все ответы верны. Отличная работа!</p>
        )}
        <p className="mt-4 text-sm text-muted-foreground">Результат добавлен в ваш прогресс.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/progress" className="btn-primary">
            Мой прогресс
          </Link>
          <Link to="/" className="btn-ghost">
            На главную
          </Link>
        </div>
      </main>
    );
  }
  const question = questions[index]!;
  return (
    <main className="mx-auto max-w-xl px-5 py-10">
      <Link to="/" className="btn-ghost">
        Выйти
      </Link>
      <p className="mt-5 text-sm text-muted-foreground">
        При выходе до завершения итог не сохраняется; ответы на карточки сохраняются сразу.
      </p>
      {!audioAvailable && (
        <p className="mt-3 text-sm" role="status">
          Озвучка недоступна. Аудирование заменено заданиями на фразы.
        </p>
      )}
      <p className="mt-6 text-sm font-semibold">
        {AREA_LABELS[question.area]} · {index + 1}/{questions.length}
      </p>
      <section className="card-soft mt-4 p-6">
        <h1 className="text-2xl font-semibold">{question.prompt}</h1>
        {question.audio && (
          <button className="btn-ghost mt-4" onClick={() => speak(question.audio!)}>
            Прослушать
          </button>
        )}
        <div className="mt-6 grid gap-3">
          {question.options.map((option) => (
            <button
              key={option}
              disabled={picked !== null}
              className={`option ${picked !== null ? (option === question.answer ? "border-success bg-accent" : option === picked ? "border-destructive" : "") : ""}`}
              onClick={() => {
                if (answered.current) return;
                answered.current = true;
                const ok = option === question.answer;
                setPicked(option);
                setScore((previous) => ({
                  ...previous,
                  [question.area]: {
                    correct: previous[question.area].correct + (ok ? 1 : 0),
                    total: previous[question.area].total + 1,
                  },
                }));
                if (!ok)
                  setMistakes((previous) => [
                    ...previous,
                    `${question.prompt} — ${question.answer}`,
                  ]);
                update((previous) =>
                  touchStreak({
                    ...previous,
                    cards: {
                      ...previous.cards,
                      [question.wordId]: review(previous.cards[question.wordId], ok),
                    },
                    weakAreas: ok
                      ? previous.weakAreas
                      : {
                          ...previous.weakAreas,
                          [question.area]: (previous.weakAreas[question.area] ?? 0) + 1,
                        },
                  }),
                );
              }}
            >
              {option}
            </button>
          ))}
        </div>
        {picked !== null && (
          <>
            <p className="mt-4" role="status">
              {picked === question.answer ? "Верно." : `Правильный ответ: ${question.answer}.`}
            </p>
            <button
              className="btn-primary mt-6 w-full"
              onClick={() => {
                if (index + 1 === questions.length && !saved.current) {
                  saved.current = true;
                  update((previous) => ({
                    ...previous,
                    weeklyResult: {
                      completedAt: Date.now(),
                      correct: Object.values(score).reduce((sum, area) => sum + area.correct, 0),
                      total: questions.length,
                      areas: score,
                    },
                  }));
                }
                answered.current = false;
                setPicked(null);
                setIndex((n) => n + 1);
              }}
            >
              {index + 1 === questions.length ? "Показать результат" : "Дальше"}
            </button>
          </>
        )}
      </section>
    </main>
  );
}
