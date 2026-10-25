import { useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { speak, type CardState } from "@/lib/store";
import { grammarReview, grammarTopicProgress, grammarTheory } from "@/lib/grammar-review";
import { shuffle } from "@/lib/learning";
import {
  FORMS,
  TENSES,
  grammarAnswerCorrect,
  grammarTasks,
  type GrammarTask,
  type SentenceForm,
  type Tense,
} from "@/lib/free-trainer";

const TASKS = grammarTasks();
export function FreeTrainer({
  history,
  cards = {},
  onAnswer,
  onComplete,
}: {
  history: boolean[];
  cards?: Record<string, CardState>;
  onAnswer: (correct: boolean, taskId?: string) => void;
  onComplete: () => void;
}) {
  const [tense, setTense] = useState<Tense | "all">("present");
  const [form, setForm] = useState<SentenceForm | "all">("positive");
  const [typed, setTyped] = useState(false);
  const [round, setRound] = useState<GrammarTask[] | null>(null);
  const [roundId, setRoundId] = useState(0);
  const start = (items?: GrammarTask[]) => {
    setRound(
      shuffle(
        items ??
          TASKS.filter(
            (task) =>
              (tense === "all" || task.tense === tense) && (form === "all" || task.form === form),
          ),
      ).slice(0, 10),
    );
    setRoundId((value) => value + 1);
  };
  const correct = history.filter(Boolean).length;
  const due = grammarReview(cards);
  const ruleTask = TASKS.find((task) => task.tense === tense && task.form === form);
  const topic = grammarTopicProgress(cards, tense, form);
  return (
    <section>
      <h1 className="page-title">Свободный тренажёр</h1>
      {!round && (
        <p className="subcopy mb-5">
          Доведи базовые конструкции до уверенного ответа: три времени Simple, вопросы, отрицания и
          утверждения. 216 комбинаций, без дневного лимита.
        </p>
      )}
      <div className="card-soft mb-5 p-4" aria-label="Статистика тренажёра">
        <strong>
          {history.length
            ? `${Math.round((correct / history.length) * 100)}% самостоятельно`
            : "Начнём с первой тренировки"}
        </strong>
        {!round && (
          <p className="mt-1 text-sm text-muted-foreground">
            {correct} верных из {history.length} последних ответов (до 100). Подсказка считается
            ответом с помощью. Это статистика практики, не оценка уровня языка.
          </p>
        )}
      </div>
      {round ? (
        <GrammarRound
          key={roundId}
          tasks={round}
          typed={typed}
          onAnswer={onAnswer}
          onComplete={onComplete}
          onNext={start}
          onExit={() => setRound(null)}
        />
      ) : (
        <div className="card-soft space-y-4 p-5">
          {due.length > 0 && (
            <button className="btn-primary w-full" onClick={() => start(due)}>
              Повторить фразы · {due.length}
            </button>
          )}
          <details>
            <summary className="min-h-12 cursor-pointer font-semibold">
              {tense === "all"
                ? "Все темы вперемешку"
                : `${TENSES[tense]} · ${form === "all" ? "Все формы" : FORMS[form]}`}
            </summary>
            <div className="grammar-topics">
              {Object.entries(TENSES).flatMap(([time, title]) =>
                Object.entries(FORMS).map(([kind, label]) => {
                  const progress = grammarTopicProgress(cards, time, kind);
                  return (
                    <button
                      key={`${time}-${kind}`}
                      className="grammar-topic"
                      aria-pressed={tense === time && form === kind}
                      onClick={() => {
                        setTense(time as Tense);
                        setForm(kind as SentenceForm);
                      }}
                    >
                      <strong>{title}</strong>
                      <span>{label}</span>
                      <small>
                        Закреплено {progress.reinforced}/{progress.total}
                      </small>
                    </button>
                  );
                }),
              )}
            </div>
            <button
              className="btn-ghost w-full mt-3"
              aria-pressed={tense === "all"}
              onClick={() => {
                setTense("all");
                setForm("all");
              }}
            >
              Все темы вперемешку
            </button>
          </details>
          {ruleTask && (
            <section className="grammar-theory" aria-label="Правило перед практикой">
              <h2 className="font-bold">Коротко о конструкции</h2>
              <p className="mt-2 text-sm leading-6">{grammarTheory(tense, form)}</p>
              <p className="mt-3 font-semibold">{ruleTask.en}</p>
              <p className="text-sm text-muted-foreground">{ruleTask.ru}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                Попробовал {topic.practiced} из {topic.total} фраз · закрепил {topic.reinforced}.
                Закрепление — несколько самостоятельных ответов, с возвратом к фразе позже.
              </p>
            </section>
          )}
          <label className="flex min-h-11 items-center gap-3">
            <input
              type="checkbox"
              checked={typed}
              onChange={(event) => setTyped(event.target.checked)}
            />
            Вводить ответ самому, без слов-кнопок
          </label>
          <button className="btn-primary w-full" onClick={() => start()}>
            Начать 10 предложений
          </button>
          <p className="text-sm text-muted-foreground">
            После каждого ответа — объяснение. После серии можно повторить ошибки или взять новые
            предложения.
          </p>
        </div>
      )}
    </section>
  );
}

export function GrammarRound({
  tasks,
  typed,
  onAnswer,
  onComplete,
  onNext,
  onExit,
}: {
  tasks: GrammarTask[];
  typed: boolean;
  onAnswer: (correct: boolean, taskId?: string) => void;
  onComplete: () => void;
  onNext: (items?: GrammarTask[]) => void;
  onExit: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [missed, setMissed] = useState<GrammarTask[]>([]);
  const completed = useRef(false);
  const task = tasks[index];
  const finish = () => {
    if (!completed.current) {
      completed.current = true;
      onComplete();
    }
  };
  if (!task)
    return (
      <section className="card-soft p-5">
        <h2 className="text-2xl font-bold">Серия завершена</h2>
        <p className="my-4" role="status">
          Самостоятельно: {tasks.length - missed.length} из {tasks.length}.
        </p>
        {missed.length > 0 && (
          <button
            className="btn-primary mb-3 w-full"
            onClick={() => {
              finish();
              onNext(missed);
            }}
          >
            Повторить сложные ({missed.length})
          </button>
        )}
        <button
          className="btn-primary w-full"
          onClick={() => {
            finish();
            onNext();
          }}
        >
          Ещё 10 предложений
        </button>
        <button
          className="btn-ghost mt-3 w-full"
          onClick={() => {
            finish();
            onExit();
          }}
        >
          Завершить и выбрать настройки
        </button>
      </section>
    );
  return (
    <>
      <p className="eyebrow mb-3">
        Предложение {index + 1} из {tasks.length}
      </p>
      <GrammarQuestion
        key={task.id}
        task={task}
        typed={typed}
        onAnswer={(correct) => {
          onAnswer(correct, task.id);
          if (!correct) setMissed((values) => [...values, task]);
        }}
        onNext={() => setIndex((value) => value + 1)}
      />
      <button className="btn-ghost mt-4 min-h-11" onClick={onExit}>
        Выйти к настройкам
      </button>
    </>
  );
}

export function GrammarQuestion({
  task,
  typed,
  onAnswer,
  onNext,
}: {
  task: GrammarTask;
  typed: boolean;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}) {
  const [tokens] = useState(() => {
    const words = task.en.replace(/[.?]/g, "").split(" ");
    return shuffle([
      ...words,
      ...["do", "does", "did", "will", "not"].filter(
        (word) => !words.some((existing) => existing.toLowerCase() === word),
      ),
    ]);
  });
  const [picked, setPicked] = useState<number[]>([]);
  const [text, setText] = useState("");
  const [hint, setHint] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const lock = useRef(false);
  const advanced = useRef(false);
  const answer = typed ? text : picked.map((index) => tokens[index]).join(" ");
  const submit = (skip = false) => {
    if (lock.current || (!skip && !answer.trim())) return;
    lock.current = true;
    const correct = !skip && grammarAnswerCorrect(answer, task.en);
    setResult(correct);
    onAnswer(correct && !hint);
  };
  return (
    <section className="card-soft p-5">
      <p className="text-sm text-primary">
        {TENSES[task.tense]} · {FORMS[task.form]}
      </p>
      <h2 className="my-4 text-2xl font-bold">{task.ru}</h2>
      <p className="subcopy mb-4">
        Используй глагол <strong>{task.verb}</strong>.{" "}
        {typed
          ? "Сокращения вроде doesn't принимаются."
          : "Нажимай слова по порядку. Есть лишние слова."}
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {typed ? (
          <>
            <label htmlFor="grammar-answer" className="mb-2 block">
              Твой перевод
            </label>
            <textarea
              id="grammar-answer"
              className="input-field min-h-24 w-full"
              value={text}
              onChange={(event) => setText(event.target.value)}
              disabled={result !== null}
              autoCapitalize="none"
              autoComplete="off"
              spellCheck={false}
            />
          </>
        ) : (
          <>
            <p
              className="min-h-16 rounded-xl bg-muted p-3"
              aria-live="polite"
              aria-label="Собранное предложение"
            >
              {answer || "Здесь появится твоё предложение"}
            </p>
            <div className="my-4 flex flex-wrap gap-2">
              {tokens.map((word, index) => (
                <button
                  type="button"
                  key={index}
                  className="btn-ghost min-h-11 min-w-11 border border-border px-3"
                  disabled={result !== null || picked.includes(index)}
                  onClick={() => setPicked((values) => [...values, index])}
                >
                  {word}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn-ghost min-h-11"
              disabled={!picked.length || result !== null}
              onClick={() => setPicked((values) => values.slice(0, -1))}
            >
              Убрать последнее слово
            </button>
          </>
        )}
        {result === null && (
          <>
            <button className="btn-primary mt-4 w-full" disabled={!answer.trim()}>
              Проверить
            </button>
            <button type="button" className="btn-ghost mt-3 w-full" onClick={() => submit(true)}>
              Пока не знаю — разобрать
            </button>
            <button
              type="button"
              className="btn-ghost mt-2 w-full"
              disabled={hint}
              onClick={() => setHint(true)}
            >
              Подсказка по конструкции
            </button>
          </>
        )}
      </form>
      {(hint || result !== null) && <p className="mt-4 text-sm leading-6">{task.rule}</p>}
      {result !== null && (
        <div role="status" className="mt-5">
          <p className="font-bold">
            {result
              ? hint
                ? "Верно с подсказкой"
                : "Верно самостоятельно!"
              : "Разберём конструкцию"}
          </p>
          <p className="mt-2 text-lg font-semibold">{task.en}</p>
          <button className="btn-ghost mt-3 min-h-12" onClick={() => speak(task.en)}>
            <Volume2 size={18} aria-hidden="true" /> Послушать фразу
          </button>
          <button
            className="btn-primary mt-5 w-full"
            onClick={() => {
              if (!advanced.current) {
                advanced.current = true;
                onNext();
              }
            }}
          >
            Дальше
          </button>
        </div>
      )}
    </section>
  );
}
