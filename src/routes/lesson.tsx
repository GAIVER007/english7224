import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, LockKeyhole, Play, Volume2 } from "lucide-react";
import { TrainingHeader } from "@/components/TrainingUI";
import { RecallPractice } from "@/components/RecallPractice";
import { recordPractice } from "@/lib/motivation";
import { Assessment } from "@/components/Assessment";
import { createMissionAssessment, createModuleAssessment } from "@/lib/assessment";
import { courseModules, pendingModule, moduleAvailable } from "@/lib/curriculum";
import { finishLessonExam, finishModuleExam } from "@/lib/learning";
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

import { canOpenStep, completeStep, dueWords, studiedWords, wordPool } from "@/lib/learning";
import { WordQuiz } from "@/components/WordQuiz";
import { SpeakingPractice } from "@/components/SpeakingPractice";
import { mistakeWords } from "@/lib/mistakes";
import { SkillPractice } from "@/components/SkillPractice";
import { FreeTrainer } from "@/components/FreeTrainer";
import { reviewGrammar } from "@/lib/grammar-review";
import { appendGrammarResult } from "@/lib/free-trainer";

export const Route = createFileRoute("/lesson")({
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    review?: boolean | undefined;
    recall?: boolean | undefined;
    mistakes?: boolean | undefined;
    training?: boolean | undefined;
    free?: boolean | undefined;
    module?: number | undefined;
    practice?: number | undefined;
  } => ({
    free: search["free"] === true || search["free"] === "true" ? true : undefined,
    training: search["training"] === true || search["training"] === "true" ? true : undefined,
    module:
      Number.isInteger(Number(search["module"])) &&
      Number(search["module"]) >= 1 &&
      Number(search["module"]) <= 6
        ? Number(search["module"])
        : undefined,
    practice:
      Number.isInteger(Number(search["practice"])) &&
      Number(search["practice"]) >= 1 &&
      Number(search["practice"]) <= lessons.length
        ? Number(search["practice"])
        : undefined,
    recall: search["recall"] === true || search["recall"] === "true" ? true : undefined,
    mistakes: search["mistakes"] === true || search["mistakes"] === "true" ? true : undefined,
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
  const {
    review: reviewOnly,
    recall: recallOnly,
    module: moduleId,
    practice,
    mistakes,
    training,
    free,
  } = Route.useSearch();
  if (!ready)
    return (
      <main className="p-8" role="status">
        Загружаем урок…
      </main>
    );
  if (!state.level)
    return (
      <main className="app-shell focus-shell">
        <h1 className="text-3xl">Сначала выберите уровень</h1>
        <Link to="/placement" search={{ choose: true }} className="btn-primary mt-6">
          Выбрать уровень
        </Link>
      </main>
    );
  if (free)
    return (
      <main className="app-shell focus-shell">
        <TrainingHeader title="Свободная практика" detail="Базовая грамматика без спешки" />
        <FreeTrainer
          history={state.grammarHistory ?? []}
          cards={state.grammarCards ?? {}}
          onAnswer={(correct, taskId) =>
            update((s) => ({
              ...s,
              grammarHistory: appendGrammarResult(s.grammarHistory ?? [], correct),
              grammarCards: taskId
                ? { ...s.grammarCards, [taskId]: reviewGrammar(s.grammarCards?.[taskId], correct) }
                : (s.grammarCards ?? {}),
            }))
          }
          onComplete={() => update((s) => recordPractice(touchStreak(s)))}
        />
      </main>
    );
  if (training) return <SkillSession state={state} update={update} />;
  if (mistakes) return <RecallSession key="mistakes" state={state} update={update} mistakes />;
  if (recallOnly) return <RecallSession key="recall" state={state} update={update} />;
  if (reviewOnly) return <ReviewSession state={state} update={update} />;
  if (practice && practice < state.day)
    return <RevisionSession key={practice} day={practice} state={state} update={update} />;
  const pending = pendingModule(state);
  const selectedModule = moduleId ? courseModules.find((item) => item.id === moduleId) : pending;
  if (selectedModule) {
    if (moduleAvailable(state, selectedModule.id))
      return (
        <ModuleSession
          key={selectedModule.id}
          moduleId={selectedModule.id}
          state={state}
          update={update}
        />
      );
    return (
      <main className="app-shell">
        <TrainingHeader
          title="Экзамен пока закрыт"
          detail={
            state.day > selectedModule.endDay
              ? "Сначала сдай экзамен предыдущего модуля"
              : "Сначала заверши все пять миссий модуля"
          }
        />
        <Link to="/lesson" search={{ module: undefined }} className="btn-primary mt-6">
          Продолжить миссию
        </Link>
      </main>
    );
  }
  if (state.day > lessons.length)
    return (
      <main className="app-shell focus-shell">
        <h1 className="text-3xl">Все модули пройдены</h1>
        <p className="mt-4">
          Ты прошёл {lessons.length} миссий и экзамены модулей. Это этап практики A2–B1, а не весь
          английский. Продолжай повторять трудные слова, проверять изученное и пересказывать диалоги
          своими словами.
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
    <main className="app-shell focus-shell">
      <TrainingHeader title="Не дать словам забыться" detail="Вспоминаем то, что уже изучили" />
      <h1 className="page-title">Повторение слов</h1>
      <section className="card-soft mt-6 p-6">
        <WordQuiz
          words={words}
          pool={wordPool}
          onDone={() => void nav({ to: "/" })}
          onAnswer={(id, ok) =>
            update((s) =>
              recordPractice(
                touchStreak({ ...s, cards: { ...s.cards, [id]: review(s.cards[id], ok) } }),
              ),
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
    <main className="app-shell focus-shell">
      <TrainingHeader title={lesson.titleRu} detail={`Миссия ${day} · ${lesson.title}`} />
      <nav aria-label="Этапы урока" className="step-nav">
        {STEPS.map((value, index) => (
          <button
            key={value}
            disabled={!canOpenStep(state, day, value)}
            aria-label={STEP_LABELS[value]}
            onClick={() => {
              setStep(value);
              setWi(0);
            }}
            className={state.steps[`${day}:${value}`] ? "completed" : ""}
            aria-current={value === cur ? "step" : undefined}
          >
            {state.steps[`${day}:${value}`] ? (
              <Check size={18} className="mx-auto" aria-hidden="true" />
            ) : (
              index + 1
            )}
          </button>
        ))}
      </nav>
      <div className="section-heading">
        <h1 className="text-xl font-extrabold">{STEP_LABELS[cur]}</h1>
        <span>Шаг {STEPS.indexOf(cur) + 1} из 6</span>
      </div>

      <section key={cur} className="lesson-stage">
        {cur === "review" && (
          <WordQuiz words={reviewWords} pool={pool} onAnswer={answer} onDone={complete} />
        )}

        {cur === "words" && (
          <div className="word-card">
            <p className="text-sm text-muted-foreground">
              {wi + 1} / {lesson.words.length}
            </p>
            <h2 className="mt-2 text-5xl font-semibold">{w.en}</h2>
            <p className="mt-1 text-muted-foreground">{w.ipa}</p>
            <p className="mt-4 text-xl font-semibold">{w.ru}</p>
            <button className="btn-ghost mt-4" onClick={() => speak(w.en)}>
              <Volume2 size={18} aria-hidden="true" /> Послушать
            </button>
            <div className="word-example">
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
                      className="mt-2 block min-h-12 w-full rounded-xl bg-muted px-4 py-3 text-left hover:bg-accent"
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
                <Play size={17} aria-hidden="true" /> Весь диалог
              </button>
              {[0.75, 1, 1.25].map((r) => (
                <button
                  key={r}
                  onClick={() => setRate(r)}
                  aria-pressed={rate === r}
                  className={`min-h-11 min-w-11 rounded-full px-3 py-1 text-sm font-semibold ${rate === r ? "bg-secondary text-secondary-foreground" : "bg-muted"}`}
                >
                  {r}x
                </button>
              ))}
              <button
                className="min-h-11 ml-auto text-sm font-semibold underline"
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
          <>
            <p className="mb-5 text-sm text-muted-foreground">
              7 вопросов: слова без подсказок, понимание фраз и грамматика. Нужно минимум 6 верных
              ответов. Речевая практика уже пройдена; этот экзамен не оценивает произношение.
            </p>
            <Assessment
              makeQuestions={() => createMissionAssessment(lesson)}
              onAnswer={answer}
              onFinish={(result) => {
                update((s) => finishLessonExam(s, day, result));
                if (result.correct / result.total >= 0.8) void nav({ to: "/" });
              }}
            />
          </>
        )}
      </section>
    </main>
  );
}

function RecallSession({ state, update, mistakes = false }: SessionProps & { mistakes?: boolean }) {
  const [words] = useState(() => (mistakes ? mistakeWords(state) : studiedWords(state)));
  const nav = useNavigate();
  return (
    <main className="app-shell focus-shell">
      <TrainingHeader
        title={mistakes ? "Работа над ошибками" : "Вызов памяти"}
        detail="Без вариантов. Только ты и твоя память."
      />
      {mistakes && (
        <p className="subcopy mb-4">
          До пяти изученных слов, которые пока трудно вспомнить. Ошибки вернутся в конце тренировки.
          Для закрепления нужны успешные ответы в следующих занятиях.
        </p>
      )}
      <section className="lesson-stage">
        {mistakes && words.length === 0 ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Сейчас слабых слов нет</h1>
            <p className="subcopy mt-3">
              Продолжай миссии и плановое повторение. Здесь появятся слова, с которыми возникнут
              сложности.
            </p>
            <Link to="/" className="btn-primary mt-5">
              На главную
            </Link>
          </div>
        ) : (
          <RecallPractice
            words={words}
            onDone={() => void nav({ to: "/" })}
            onAnswer={(id, correct) =>
              update((s) =>
                recordPractice(
                  touchStreak({ ...s, cards: { ...s.cards, [id]: review(s.cards[id], correct) } }),
                ),
              )
            }
          />
        )}
      </section>
    </main>
  );
}

function SkillSession({ state, update }: SessionProps) {
  const nav = useNavigate();
  return (
    <main className="app-shell focus-shell">
      <TrainingHeader title="Лаборатория речи" detail="Слушай, вспоминай, отвечай" />
      <SkillPractice
        state={state}
        onDone={(skill) => {
          update((s) => recordPractice(touchStreak(s), Date.now(), skill));
          void nav({ to: "/" });
        }}
      />
    </main>
  );
}

function ModuleSession({ state, update, moduleId }: SessionProps & { moduleId: number }) {
  const module = courseModules.find((item) => item.id === moduleId)!;
  const items = lessons.filter((item) => item.day >= module.startDay && item.day <= module.endDay);
  const nav = useNavigate();
  return (
    <main className="app-shell focus-shell">
      <TrainingHeader title={`Экзамен модуля ${module.id}`} detail={module.title} />
      <h1 className="page-title">Соберём всё вместе</h1>
      <p className="subcopy">
        15 вопросов по пяти миссиям. Нужно 12 верных ответов (80%). Ошибки можно разобрать и
        пересдать. Сдача завершает модуль. Для следующих миссий сначала нужно пройти эту проверку.
      </p>
      <section className="lesson-stage">
        <Assessment
          makeQuestions={() => createModuleAssessment(items)}
          onAnswer={(id, ok) =>
            update((s) => ({ ...s, cards: { ...s.cards, [id]: review(s.cards[id], ok) } }))
          }
          onFinish={(result) => {
            update((s) => finishModuleExam(s, moduleId, result));
            if (result.correct / result.total >= 0.8) void nav({ to: "/" });
          }}
        />
      </section>
    </main>
  );
}

function RevisionSession({ day, update }: SessionProps & { day: number }) {
  const lesson = lessons[day - 1]!;
  const [mode, setMode] = useState<"notes" | "speaking" | "exam">("notes");
  const nav = useNavigate();
  return (
    <main className="app-shell focus-shell">
      <TrainingHeader
        title={lesson.titleRu}
        detail={`Повторение миссии ${day} · ${lesson.level}`}
      />
      <h1 className="page-title">Сделаем увереннее</h1>
      <p className="subcopy">
        Можно вернуться в любую пройденную миссию. Повторная проверка не отменяет результат и не
        даёт XP за уже выполненные этапы.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {(
          [
            ["notes", "Материал"],
            ["speaking", "Говорить"],
            ["exam", "Проверка"],
          ] as const
        ).map(([value, label]) => (
          <button
            className="btn-ghost"
            key={value}
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <section className="lesson-stage" key={mode}>
        {mode === "notes" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">{lesson.grammar.title}</h2>
              <p className="mt-2">{lesson.grammar.rule}</p>
              {lesson.grammar.examples.map((item) => (
                <p key={item} className="mt-2">
                  {item}
                </p>
              ))}
            </div>
            <div>
              <h2 className="text-xl font-bold">Слова в контексте</h2>
              {lesson.words.map((word) => (
                <div key={word.id} className="border-b border-border py-3">
                  <button className="btn-ghost" onClick={() => speak(word.en)}>
                    {word.en} <Volume2 size={16} aria-label="Послушать слово" />
                  </button>
                  <p>{word.ru}</p>
                  <p className="mt-2 text-sm">{word.example}</p>
                  <p className="text-sm text-muted-foreground">{word.exampleRu}</p>
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-xl font-bold">Понять и пересказать</h2>
              <p className="my-3 text-sm">
                Прослушай диалог, затем закрой текст и перескажи ситуацию своими словами. Это
                самостоятельная практика без автоматической оценки.
              </p>
              <button
                className="btn-primary w-full"
                onClick={() => speak(lesson.dialogue.map((line) => line.en).join(" "))}
              >
                Прослушать диалог
              </button>
              {lesson.dialogue.map((line, i) => (
                <p key={i} className="mt-3">
                  {line.en}
                  <span className="block text-sm text-muted-foreground">{line.ru}</span>
                </p>
              ))}
            </div>
          </div>
        )}
        {mode === "speaking" && (
          <SpeakingPractice items={lesson.speaking} onDone={() => setMode("notes")} />
        )}
        {mode === "exam" && (
          <Assessment
            makeQuestions={() => createMissionAssessment(lesson)}
            onAnswer={(id, ok) =>
              update((s) => ({ ...s, cards: { ...s.cards, [id]: review(s.cards[id], ok) } }))
            }
            onFinish={(result) => {
              if (result.correct / result.total >= 0.8) void nav({ to: "/" });
            }}
          />
        )}
      </section>
    </main>
  );
}
