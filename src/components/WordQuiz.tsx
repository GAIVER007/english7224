import { useRef, useState } from "react";
import type { Word } from "@/lib/content";
import { PASS_PERCENT, shuffle } from "@/lib/learning";

interface Props {
  words: Word[];
  pool: Word[];
  onDone: () => void;
  onAnswer: (id: string, correct: boolean) => void;
  requirePass?: boolean;
}

export function WordQuiz({ words, pool, onDone, onAnswer, requirePass = false }: Props) {
  const [attempt, setAttempt] = useState(0);
  return (
    <QuizAttempt
      key={attempt}
      words={words}
      pool={pool}
      onDone={onDone}
      onAnswer={onAnswer}
      requirePass={requirePass}
      onRetry={() => setAttempt((n) => n + 1)}
    />
  );
}

function QuizAttempt({
  words,
  pool,
  onDone,
  onAnswer,
  requirePass,
  onRetry,
}: Props & { onRetry: () => void }) {
  // A question set is a snapshot: state updates must not reorder answers mid-session.
  const [questions] = useState(() =>
    words.map((word) => ({
      word,
      options: shuffle([
        word,
        ...shuffle(pool.filter((item) => item.id !== word.id && item.ru !== word.ru)).slice(0, 3),
      ]),
    })),
  );
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState<Word[]>([]);
  const answered = useRef(false);

  if (!questions.length)
    return (
      <div>
        <h2 className="text-2xl font-semibold">Повторение на сегодня завершено</h2>
        <p className="mt-3 text-muted-foreground">Карточек с наступившим сроком пока нет.</p>
        <button className="btn-primary mt-6" onClick={onDone}>
          Дальше
        </button>
      </div>
    );
  if (index >= questions.length) {
    const percent = Math.round((correct / questions.length) * 100);
    const passed = !requirePass || percent >= PASS_PERCENT;
    return (
      <div>
        <h2 className="text-3xl font-semibold">
          Результат: {correct} из {questions.length}
        </h2>
        <p className="mt-3" role="status">
          {passed
            ? "Практика завершена."
            : `Для завершения урока нужно ${PASS_PERCENT}% правильных ответов. Повторите слова и попробуйте ещё раз.`}
        </p>
        {mistakes.length > 0 && (
          <div className="mt-5">
            <h3 className="font-semibold">Повторите эти слова</h3>
            <ul className="mt-2 space-y-2">
              {mistakes.map((word) => (
                <li key={word.id}>
                  {word.en} — {word.ru}
                </li>
              ))}
            </ul>
          </div>
        )}
        {passed ? (
          <button className="btn-primary mt-6 w-full" onClick={onDone}>
            Продолжить
          </button>
        ) : (
          <button className="btn-primary mt-6 w-full" onClick={onRetry}>
            Повторить мини-тест
          </button>
        )}
      </div>
    );
  }
  const question = questions[index]!;
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {index + 1} / {questions.length}
      </p>
      <h2 className="mt-2 text-3xl font-semibold">Как переводится «{question.word.en}»?</h2>
      <div className="mt-6 grid gap-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            disabled={picked !== null}
            className={`option ${picked !== null ? (option.id === question.word.id ? "border-success bg-accent" : option.id === picked ? "border-destructive" : "") : ""}`}
            onClick={() => {
              if (answered.current) return;
              answered.current = true;
              const ok = option.id === question.word.id;
              setPicked(option.id);
              if (ok) setCorrect((n) => n + 1);
              else setMistakes((items) => [...items, question.word]);
              onAnswer(question.word.id, ok);
            }}
          >
            {option.ru}
          </button>
        ))}
      </div>
      {picked !== null && (
        <>
          <p className="mt-4" role="status">
            {picked === question.word.id ? "Верно." : `Правильный ответ: ${question.word.ru}.`}
          </p>
          <button
            className="btn-primary mt-6 w-full"
            onClick={() => {
              answered.current = false;
              setPicked(null);
              setIndex((n) => n + 1);
            }}
          >
            Дальше
          </button>
        </>
      )}
    </div>
  );
}
