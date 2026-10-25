import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpenCheck, Check, Volume2 } from "lucide-react";
import { shuffle } from "@/lib/learning";
import { useAppState, speak } from "@/lib/store";
import { BottomNav, TrainingHeader } from "@/components/TrainingUI";
import { RecallPractice } from "@/components/RecallPractice";
import { WritingFeedback } from "@/components/WritingFeedback";
import { SpeakingRecorder } from "@/components/SpeakingRecorder";
import { pathUnits, PATH_LEVELS, levelTitles, unitsForLevel, levelQuestions } from "@/lib/pathway";
import { revisionUnits } from "@/lib/pathway/plan";
import { emptyPath, emptyUnit, examBankVersion } from "@/lib/pathway/state";
import {
  saveUnit,
  submitUnit,
  productionReady,
  wordCount,
  canTakeLevel,
  submitLevel,
  startNextLevelAttempt,
} from "@/lib/pathway/progress";
import type { PathLevel, PathQuestion, PathUnit } from "@/lib/pathway/types";
import {
  duePathVocabulary,
  formatPathVocabularyDue,
  learnedPathVocabularyCount,
  learnPathVocabulary,
  nextPathVocabularyDue,
  reviewPathVocabulary,
} from "@/lib/pathway/vocabulary";

export const Route = createFileRoute("/course")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { unit?: string | undefined; exam?: PathLevel | undefined; review?: string | undefined } => ({
    unit: typeof search["unit"] === "string" ? search["unit"] : undefined,
    exam: PATH_LEVELS.includes(search["exam"] as PathLevel)
      ? (search["exam"] as PathLevel)
      : undefined,
    review:
      search["review"] === "due" || pathUnits.some((unit) => unit.id === search["review"])
        ? (search["review"] as string)
        : undefined,
  }),
  head: () => ({ meta: [{ title: "Программа A0–C1 — SpeakUp" }] }),
  component: Course,
});
const STAGES = ["Разобраться", "Прочитать", "Послушать", "Написать", "Сказать", "Мини-экзамен"];
function Audio({ text }: { text: string }) {
  useEffect(
    () => () => {
      window.speechSynthesis?.cancel();
    },
    [text],
  );
  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn-secondary" onClick={() => speak(text)}>
        <Volume2 size={18} aria-hidden="true" /> Слушать
      </button>
      <button className="btn-ghost" onClick={() => speak(text, 0.75)}>
        Медленнее
      </button>
      <button className="btn-ghost" onClick={() => window.speechSynthesis?.cancel()}>
        Стоп
      </button>
    </div>
  );
}
function Checks({
  items,
  values,
  onChange,
}: {
  items: string[];
  values: boolean[];
  onChange: (values: boolean[]) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <label className="flex gap-3 min-h-12 items-center" key={item}>
          <input
            type="checkbox"
            checked={values[i] ?? false}
            onChange={(e) => onChange(values.map((v, j) => (j === i ? e.target.checked : v)))}
          />
          <span>{item}</span>
        </label>
      ))}
    </div>
  );
}
function Question({
  question,
  value,
  disabled,
  onAnswer,
  index,
}: {
  question: PathQuestion;
  value: string;
  disabled: boolean;
  onAnswer: (v: string) => void;
  index: number;
}) {
  const [options] = useState(() => shuffle(question.options));
  return (
    <fieldset className="card-soft p-4 space-y-3">
      <legend className="font-semibold px-1">
        {index + 1}.{" "}
        {question.skill === "grammar"
          ? "Грамматика"
          : question.skill === "reading"
            ? "Чтение"
            : "Аудирование"}{" "}
        · {question.prompt}
      </legend>
      {options.map((option) => (
        <label key={option} className={`path-option ${value === option ? "selected" : ""}`}>
          <input
            type="radio"
            name={`question-${index}`}
            value={option}
            checked={value === option}
            disabled={disabled}
            onChange={() => onAnswer(option)}
          />
          <span>{option}</span>
        </label>
      ))}
      {disabled && (
        <p className="text-sm" role="status">
          {value === question.answer ? "Верно. " : `Правильный ответ: ${question.answer}. `}
          {question.explanation}
        </p>
      )}
    </fieldset>
  );
}
function Course() {
  const { state, ready, update } = useAppState();
  const { unit: unitId, exam, review } = Route.useSearch();
  const path = state.pathway ?? emptyPath();
  const unit = pathUnits.find((u) => u.id === unitId);
  const [historyCount, setHistoryCount] = useState(10);
  if (!ready)
    return (
      <main className="app-shell" role="status">
        Загружаем программу…
      </main>
    );
  if (review) return <VocabularySession key={review} scope={review} />;
  if (unit) return <UnitSession key={unit.id} unit={unit} />;
  if (exam) return <LevelExam key={exam} level={exam} />;
  const units = unitsForLevel(path.selected);
  const passed = units.filter((u) => path.units[u.id]?.passed).length;
  const next = units.find((u) => !path.units[u.id]?.passed);
  const due = pathUnits.filter(
    (u) => path.units[u.id]?.passed && path.units[u.id]!.due <= Date.now(),
  );
  const dueWords = duePathVocabulary(state);
  const learnedWords = learnedPathVocabularyCount(state);
  const nextWordReview = nextPathVocabularyDue(state);
  const reviewUnits = revisionUnits(state);
  return (
    <main className="app-shell focus-shell">
      <TrainingHeader title="Программа A0–C1" detail="Учись по навыкам, в своём темпе" />
      <h1 className="page-title">
        От первых слов
        <br />
        до сложных мыслей
      </h1>
      <p className="subcopy">
        Шесть этапов. В каждой теме — язык, чтение, аудирование, письмо, речь и проверка.
      </p>
      <div className="path-levels" aria-label="Этап обучения">
        {PATH_LEVELS.map((level) => (
          <button
            key={level}
            aria-pressed={path.selected === level}
            className={path.selected === level ? "selected" : ""}
            onClick={() =>
              update((s) => ({ ...s, pathway: { ...(s.pathway ?? emptyPath()), selected: level } }))
            }
          >
            {level}
          </button>
        ))}
      </div>
      <section className="card-soft p-5 space-y-4 mt-5">
        <p className="eyebrow">
          {path.selected} · {passed}/{units.length} тем
        </p>
        <h2 className="text-2xl font-semibold">{levelTitles[path.selected]}</h2>
        <progress
          className="w-full"
          value={passed}
          max={units.length}
          aria-label="Пройденные темы"
        />
        {next ? (
          <Link className="btn-primary w-full" to="/course" search={{ unit: next.id }}>
            Продолжить <ArrowRight size={18} />
          </Link>
        ) : (
          <p>Все темы этого этапа пройдены. Проверь знания в контрольной.</p>
        )}
        <p className="text-sm text-muted-foreground">
          {path.selected === "A0"
            ? "A0 — подготовка к A1: звуки, первые слова и короткие реплики."
            : "Уровень задаёт сложность материала. Его выбор не меняет твои результаты."}
        </p>
      </section>
      <section className="card-soft p-5 space-y-3 mt-4" aria-labelledby="course-vocabulary-title">
        <div className="flex items-center gap-3">
          <BookOpenCheck size={22} aria-hidden="true" />
          <h2 id="course-vocabulary-title" className="text-xl font-semibold">
            Слова в памяти
          </h2>
        </div>
        {learnedWords === 0 ? (
          <p>Добавляй слова внутри тем. Они вернутся на повторение в нужный день.</p>
        ) : (
          <p>
            В повторении: {learnedWords}. Сейчас нужно вспомнить: {dueWords.length}.
          </p>
        )}
        {dueWords.length > 0 ? (
          <Link className="btn-primary w-full" to="/course" search={{ review: "due" }}>
            Повторить {Math.min(5, dueWords.length)} слов
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground">
            {nextWordReview === null
              ? "Очередь пока пустая. Открой тему и добавь её слова."
              : `Следующее повторение — ${formatPathVocabularyDue(nextWordReview)}.`}
          </p>
        )}
      </section>
      {due.length > 0 && (
        <Link
          className="btn-secondary w-full mt-4"
          to="/course"
          search={{ unit: due[0]!.id }}
          onClick={() =>
            update((s) =>
              s.pathway?.units[due[0]!.id]?.submitted
                ? saveUnit(s, due[0]!.id, { stage: 0, submitted: false, answers: {} })
                : s,
            )
          }
        >
          Пора освежить · {due.length} тем
        </Link>
      )}
      <ol className="space-y-3 mt-6">
        {units.map((u, i) => (
          <li key={u.id}>
            <Link to="/course" search={{ unit: u.id }} className="path-unit">
              <span className="path-number">
                {path.units[u.id]?.passed ? <Check size={18} /> : i + 1}
              </span>
              <span>
                <strong>{u.title}</strong>
                <small>{u.goal}</small>
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ol>
      <section className="card-soft p-5 mt-6 space-y-3">
        <h2 className="text-xl font-semibold">Контрольная {path.selected}</h2>
        <p>
          24 новых вопроса: грамматика, чтение и аудирование. Порог — 80%. Откроется после всех тем
          и самостоятельной проверки письма и речи.
        </p>
        {canTakeLevel(state, path.selected) ? (
          <Link className="btn-primary" to="/course" search={{ exam: path.selected }}>
            {path.exams[path.selected]?.passed ? "Повторить контрольную" : "Начать контрольную"}
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground">Осталось тем: {units.length - passed}</p>
        )}
      </section>
      {reviewUnits.length > 0 && (
        <section className="card-soft p-5 mt-5 space-y-3" aria-labelledby="exam-review-title">
          <h2 id="exam-review-title" className="text-xl font-semibold">
            Закрепить после контрольной
          </h2>
          <p className="text-sm text-muted-foreground">
            Темы из последней попытки {path.selected}, где были ошибки. Повтори их и проверь себя
            снова.
          </p>
          <div className="grid gap-2">
            {reviewUnits.map((u) => (
              <Link
                key={u.id}
                to="/course"
                search={{ unit: u.id }}
                onClick={() => update((s) => saveUnit(s, u.id, { stage: 0 }))}
                className="btn-secondary justify-start"
              >
                {u.title}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      )}
      <details className="card-soft p-5 mt-5">
        <summary className="cursor-pointer font-semibold">
          История программы · {path.history.length}
        </summary>
        <ol className="space-y-3 mt-4">
          {path.history
            .slice()
            .reverse()
            .slice(0, historyCount)
            .map((r, i) => (
              <li key={`${r.at}-${i}`} className="text-sm">
                {pathUnits.find((u) => u.id === r.id)?.title ??
                  r.id.replace("exam:", "Контрольная ")}{" "}
                · {r.correct}/{r.total} · {r.passed ? "Пройдено" : "Повторить"}
                {r.id.startsWith("exam:") && r.examVersion !== undefined && (
                  <span>
                    {" "}
                    ·{" "}
                    {r.examVersion === 1
                      ? "Архивный вариант"
                      : `Вариант ${r.examVersion === 2 ? 1 : 2}`}
                  </span>
                )}
                <br />
                {new Date(r.at).toLocaleString("ru-RU")}
              </li>
            ))}
        </ol>
        {historyCount < path.history.length && (
          <button className="btn-ghost mt-3" onClick={() => setHistoryCount((n) => n + 10)}>
            Ещё 10
          </button>
        )}
      </details>
      <details className="mt-5 text-sm text-muted-foreground">
        <summary>Как понимать результаты</summary>
        <p className="mt-3">
          Письмо и речь проверяешь по образцу и критериям сам. Синтез речи зависит от устройства.
          Контрольная проверяет изученный материал и не заменяет независимый экзамен CEFR. Прогресс
          и тексты хранятся на этом устройстве и входят в резервную копию.
        </p>
      </details>
      <BottomNav />
    </main>
  );
}
function UnitSession({ unit }: { unit: PathUnit }) {
  const { state, update, storageError } = useAppState();
  const progress = state.pathway?.units[unit.id] ?? emptyUnit();
  const patch = (values: Parameters<typeof saveUnit>[2]) =>
    update((s) => saveUnit(s, unit.id, values));
  const stage = progress.stage;
  const stageHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    stageHeading.current?.focus();
  }, [stage]);
  const currentScore = unit.questions.filter(
    (q, i) => progress.answers[String(i)] === q.answer,
  ).length;
  const following = pathUnits[pathUnits.indexOf(unit) + 1];
  const learnedWords = learnedPathVocabularyCount(state, unit);
  const dueWords = duePathVocabulary(state, Date.now(), unit).length;
  return (
    <main className="app-shell focus-shell">
      <TrainingHeader title={`${unit.level} · ${unit.title}`} detail={unit.goal} />
      <Link className="btn-ghost mb-4" to="/course" search={{}}>
        Все темы
      </Link>
      <nav className="path-stages" aria-label="Этапы темы">
        {STAGES.map((title, i) => (
          <button
            key={title}
            aria-current={stage === i ? "step" : undefined}
            onClick={() => patch({ stage: i })}
          >
            {i + 1}. {title}
          </button>
        ))}
      </nav>
      <h1 ref={stageHeading} tabIndex={-1} className="text-2xl font-semibold my-5">
        {STAGES[stage]}
      </h1>
      {stage === 0 && (
        <section className="card-soft p-5 space-y-4">
          <h2 className="text-xl font-semibold">{unit.title}</h2>
          <p className="whitespace-pre-line leading-7">{unit.theory}</p>
          <ul className="space-y-2">
            {unit.examples.map((ex) => (
              <li key={ex} lang="en">
                {ex}
              </li>
            ))}
          </ul>
          <h3 className="font-semibold">Слова для этой темы</h3>
          <dl className="space-y-3">
            {unit.vocabulary.map((v) => (
              <div key={v.en}>
                <dt className="font-semibold" lang="en">
                  {v.en}
                </dt>
                <dd>{v.ru}</dd>
              </div>
            ))}
          </dl>
          {learnedWords < unit.vocabulary.length ? (
            <button
              className="btn-secondary w-full"
              type="button"
              onClick={() => update((s) => learnPathVocabulary(s, unit))}
            >
              Добавить {unit.vocabulary.length} слов в повторение
            </button>
          ) : dueWords > 0 ? (
            <Link className="btn-primary w-full" to="/course" search={{ review: unit.id }}>
              Вспомнить {Math.min(5, dueWords)} слов · осталось {dueWords}
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground" role="status">
              Все слова темы добавлены. Приложение напомнит, когда придёт срок повторения.
            </p>
          )}
          {storageError && (
            <p className="text-sm text-destructive" role="alert">
              Не удалось сохранить слова. Проверь доступ к хранилищу устройства.
            </p>
          )}
        </section>
      )}
      {stage === 1 && (
        <section className="card-soft p-5 space-y-4">
          <p>Прочитай и сформулируй основную мысль. На мини-экзамене будут вопросы по тексту.</p>
          <p lang="en" className="whitespace-pre-line leading-8">
            {unit.reading}
          </p>
        </section>
      )}
      {stage === 2 && (
        <section className="card-soft p-5 space-y-4">
          <p>Сначала послушай без текста. Затем проверь детали и повтори несколько фраз вслух.</p>
          <Audio text={unit.listening} />
          <details>
            <summary className="cursor-pointer min-h-12">Показать расшифровку</summary>
            <p lang="en" className="leading-8">
              {unit.listening}
            </p>
          </details>
        </section>
      )}
      {stage === 3 && (
        <section className="space-y-4">
          <p>{unit.writing.prompt}</p>
          <label className="block" htmlFor="path-writing">
            Твой текст · минимум {unit.writing.minWords} слов
          </label>
          <textarea
            id="path-writing"
            className="input-field w-full min-h-60"
            maxLength={4000}
            value={progress.writing}
            onChange={(e) =>
              patch({ writing: e.target.value, writingChecks: [false, false, false] })
            }
          />
          <p className="text-sm">
            {wordCount(progress.writing)} слов ·{" "}
            {storageError
              ? "не удалось сохранить — сделай резервную копию"
              : "сохранено на этом устройстве"}
          </p>
          <details className="card-soft p-4">
            <summary className="cursor-pointer">Сравнить с примером</summary>
            <p lang="en" className="mt-3 leading-7">
              {unit.writing.model}
            </p>
          </details>
          <WritingFeedback text={progress.writing} unit={unit} />
          <h2 className="font-semibold">Проверь свой текст</h2>
          <Checks
            items={unit.writing.checklist}
            values={progress.writingChecks}
            onChange={(v) => patch({ writingChecks: v })}
          />
          <p className="text-sm text-muted-foreground">
            Это самопроверка содержания и языка, а не автоматическая оценка качества текста.
          </p>
        </section>
      )}
      {stage === 4 && (
        <section className="space-y-4">
          <p className="text-lg">{unit.speaking.prompt}</p>
          <p>Ответь вслух без образца. Затем сравни, исправь и повтори ещё раз без чтения.</p>
          <details className="card-soft p-4">
            <summary className="cursor-pointer">Пример ответа</summary>
            <p lang="en" className="mt-3 leading-7">
              {unit.speaking.model}
            </p>
            <Audio text={unit.speaking.model} />
          </details>
          <SpeakingRecorder
            model={unit.speaking.model}
            onRecorded={(seconds) =>
              update((s) => {
                const current = s.pathway?.units[unit.id] ?? emptyUnit();
                return saveUnit(s, unit.id, {
                  speakingAttempts: (current.speakingAttempts ?? 0) + 1,
                  speakingSeconds: seconds,
                  speakingChecks: [false, false, false],
                });
              })
            }
          />
          {(progress.speakingAttempts ?? 0) > 0 && (
            <p className="text-sm text-muted-foreground">
              Записанных попыток: {progress.speakingAttempts}.
              {progress.speakingSeconds != null && ` Последняя: ${progress.speakingSeconds} сек.`}{" "}
              Сохраняются эти показатели и заметки, сам аудиофайл — только пока открыт этап
              «Сказать».
            </p>
          )}
          <label className="block font-medium" htmlFor="speaking-notes">
            Что улучшить в следующей попытке
          </label>
          <textarea
            id="speaking-notes"
            className="input-field w-full min-h-24"
            maxLength={2000}
            value={progress.speakingNotes ?? ""}
            onChange={(e) => patch({ speakingNotes: e.target.value })}
            placeholder="Например: меньше пауз, чётче окончания, добавить пример"
          />
          {storageError && (
            <p role="alert" className="text-sm text-destructive">
              Прогресс речи не сохранился. Проверь доступ к хранилищу устройства.
            </p>
          )}
          <Checks
            items={unit.speaking.checklist}
            values={progress.speakingChecks}
            onChange={(v) => patch({ speakingChecks: v })}
          />
        </section>
      )}
      {stage === 5 && (
        <section className="space-y-5">
          <p>
            Шесть вопросов. Для зачёта нужны 5 верных ответов, собственный текст и самопроверка
            речи.
          </p>
          {!productionReady(unit, progress) && (
            <p role="status" className="card-soft p-4">
              Сначала закончи письмо и отметь критерии самопроверки письма и речи.
            </p>
          )}
          {unit.questions.map((q, i) => (
            <section className="space-y-4" key={i}>
              {q.skill === "reading" && unit.questions[i - 1]?.skill !== "reading" && (
                <details className="card-soft p-4">
                  <summary>Текст для вопросов на понимание</summary>
                  <p lang="en" className="mt-3 leading-7">
                    {unit.reading}
                  </p>
                </details>
              )}
              {q.skill === "listening" && unit.questions[i - 1]?.skill !== "listening" && (
                <Audio text={unit.listening} />
              )}
              <Question
                question={q}
                index={i}
                value={progress.answers[String(i)] ?? ""}
                disabled={progress.submitted}
                onAnswer={(value) => patch({ answers: { ...progress.answers, [i]: value } })}
              />
            </section>
          ))}
          {progress.submitted ? (
            <div className="card-soft p-5 space-y-4" role="status">
              <h2 className="text-xl font-semibold">
                {currentScore >= 5 ? "Тема пройдена" : "Вернёмся к трудным местам"} · {currentScore}
                /6
              </h2>
              <p>
                Лучший результат: {progress.best}/6. Попыток: {progress.attempts}.
              </p>
              <button
                className="btn-secondary w-full"
                onClick={() => patch({ answers: {}, submitted: false, stage: 0 })}
              >
                Повторить тему
              </button>
              {progress.passed && following && following.level === unit.level && (
                <Link
                  to="/course"
                  search={{ unit: following.id }}
                  className="btn-primary w-full"
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      pathway: { ...(s.pathway ?? emptyPath()), selected: following.level },
                    }))
                  }
                >
                  Следующая тема
                </Link>
              )}
              {progress.passed && canTakeLevel(state, unit.level) && (
                <Link className="btn-primary w-full" to="/course" search={{ exam: unit.level }}>
                  Контрольная {unit.level}
                </Link>
              )}
              <Link to="/course" search={{}} className="btn-ghost">
                К программе
              </Link>
            </div>
          ) : (
            <button
              className="btn-primary w-full"
              disabled={
                !productionReady(unit, progress) ||
                unit.questions.some((_, i) => !progress.answers[String(i)])
              }
              onClick={() => update((s) => submitUnit(s, unit))}
            >
              Проверить ответы
            </button>
          )}
        </section>
      )}
      {stage < 5 && (
        <button className="btn-primary w-full mt-6" onClick={() => patch({ stage: stage + 1 })}>
          Далее · {STAGES[stage + 1]}
        </button>
      )}
    </main>
  );
}

function VocabularySession({ scope }: { scope: string }) {
  const { state, update, storageError } = useAppState();
  const navigate = useNavigate();
  const unit = scope === "due" ? undefined : pathUnits.find((item) => item.id === scope);
  const [sessionWords] = useState(() => duePathVocabulary(state, Date.now(), unit).slice(0, 5));

  return (
    <main className="app-shell focus-shell">
      <TrainingHeader
        title="Повторение слов"
        detail={unit ? `${unit.level} · ${unit.title}` : "По расписанию памяти"}
      />
      <Link className="btn-ghost mb-4" to="/course" search={{}}>
        К программе
      </Link>
      <p className="subcopy mb-4">
        В этой тренировке до 5 слов. Пиши перевод по памяти. Ошибка или показ ответа вернут слово на
        ближайшее повторение.
      </p>
      <section className="lesson-stage">
        {sessionWords.length > 0 ? (
          <RecallPractice
            words={sessionWords}
            onAnswer={(id, correct) => update((s) => reviewPathVocabulary(s, id, correct))}
            onDone={() => void navigate({ to: "/course", search: {} })}
          />
        ) : (
          <div className="text-center">
            <Check className="mx-auto" size={36} aria-hidden="true" />
            <h1 className="mt-4 text-2xl font-semibold">На сегодня всё повторено</h1>
            <p className="mt-2 text-muted-foreground">
              Новая короткая тренировка появится, когда подойдёт срок следующего слова.
            </p>
            <Link className="btn-primary mt-6 w-full" to="/course" search={{}}>
              К программе
            </Link>
          </div>
        )}
        {storageError && (
          <p className="mt-4 text-sm text-destructive" role="alert">
            Ответ не сохранился. Проверь доступ к хранилищу устройства.
          </p>
        )}
      </section>
    </main>
  );
}
function LevelExam({ level }: { level: PathLevel }) {
  const { state, update, storageError } = useAppState();
  const path = state.pathway ?? emptyPath();
  const exam = path.exams[level] ?? {
    version: 2 as const,
    answers: {},
    submitted: false,
    passed: false,
    best: 0,
    attempts: 0,
  };
  const version = examBankVersion(exam);
  const questions = levelQuestions(level, version);
  const missedUnits = [
    ...new Set(questions.filter((q) => exam.answers[q.id] !== q.answer).map((q) => q.unitId)),
  ];
  if (!canTakeLevel(state, level))
    return (
      <main className="app-shell">
        <TrainingHeader title={`Контрольная ${level}`} detail="Сначала заверши темы этапа" />
        <Link to="/course" search={{}} className="btn-primary mt-5">
          Вернуться к программе
        </Link>
      </main>
    );
  return (
    <main className="app-shell focus-shell">
      <TrainingHeader
        title={`Контрольная ${level}`}
        detail={
          version === 1 ? "Архивная попытка" : `Вариант ${version === 2 ? 1 : 2} из 2 · 24 вопроса`
        }
      />
      <Link to="/course" search={{}} className="btn-ghost">
        К программе
      </Link>
      {version === 1 && (
        <p className="mt-4 text-sm">
          Сохранена попытка прежней контрольной. Новая попытка откроет отдельные задания; прежние
          достижения сохранятся.
        </p>
      )}
      <p className="my-5">
        Ответы сохраняются. Разбор появится после завершения всех 24 вопросов. Порог — 20 верных.
      </p>
      <p className="mb-5 text-sm text-muted-foreground">
        Здесь проверяются три навыка. Письмо и речь оцениваются отдельно по критериям в темах. Новые
        попытки чередуют два варианта с разными заданиями. После двух вариантов вопросы повторяются.
      </p>
      {storageError && (
        <p role="alert" className="text-destructive mb-4">
          Ответы не сохранились на устройстве. Проверь доступ к хранилищу.
        </p>
      )}
      <div className="space-y-6">
        {questions.map((q, i) => (
          <section key={q.id} className="space-y-3">
            {q.skill === "reading" && questions[i - 1]?.passage !== q.passage && (
              <p lang="en" className="card-soft p-5 leading-7">
                {q.passage}
              </p>
            )}
            {q.skill === "listening" && questions[i - 1]?.passage !== q.passage && (
              <Audio text={q.passage ?? ""} />
            )}
            {exam.submitted &&
              q.skill === "listening" &&
              questions[i - 1]?.passage !== q.passage && (
                <details className="card-soft p-4">
                  <summary>Текст аудио для разбора</summary>
                  <p lang="en" className="mt-3 leading-7">
                    {q.passage}
                  </p>
                </details>
              )}
            <Question
              key={`${version}-${q.id}-${exam.attempts}`}
              question={q}
              index={i}
              value={exam.answers[q.id] ?? ""}
              disabled={exam.submitted}
              onAnswer={(value) =>
                update((s) => {
                  const p = s.pathway ?? emptyPath();
                  return {
                    ...s,
                    pathway: {
                      ...p,
                      exams: {
                        ...p.exams,
                        [level]: { ...exam, version, answers: { ...exam.answers, [q.id]: value } },
                      },
                    },
                  };
                })
              }
            />
          </section>
        ))}
      </div>
      {exam.submitted ? (
        <section className="card-soft p-5 mt-5 space-y-4" role="status">
          <h2 className="text-xl font-semibold">
            Результат: {questions.filter((q) => exam.answers[q.id] === q.answer).length}/
            {questions.length}
          </h2>
          <p>
            Лучший: {exam.best}/{questions.length}.{" "}
            {exam.passed ? "Контрольная пройдена." : "Повтори темы, в которых были ошибки."}
          </p>
          <ul className="space-y-2">
            {(["grammar", "reading", "listening"] as const).map((skill) => (
              <li key={skill}>
                {{ grammar: "Грамматика", reading: "Чтение", listening: "Аудирование" }[skill]}:{" "}
                {
                  questions.filter((q) => q.skill === skill && exam.answers[q.id] === q.answer)
                    .length
                }
                /8
              </li>
            ))}
          </ul>
          {missedUnits.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Что повторить</h3>
              {missedUnits.map((id) => (
                <Link
                  key={id}
                  to="/course"
                  search={{ unit: id }}
                  onClick={() => update((s) => saveUnit(s, id, { stage: 0 }))}
                  className="btn-secondary w-full justify-start"
                >
                  {pathUnits.find((u) => u.id === id)?.title}
                </Link>
              ))}
            </div>
          )}
          <button
            className="btn-secondary"
            onClick={() => update((s) => startNextLevelAttempt(s, level))}
          >
            Новая попытка
          </button>
          <Link to="/course" search={{}} className="btn-primary">
            К программе
          </Link>
        </section>
      ) : (
        <button
          className="btn-primary w-full mt-6"
          disabled={questions.some((q) => !exam.answers[q.id])}
          onClick={() => update((s) => submitLevel(s, level))}
        >
          Завершить контрольную
        </button>
      )}
    </main>
  );
}
