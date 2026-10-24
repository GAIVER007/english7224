import { useEffect, useRef, useState } from "react";
import { Volume2, RotateCcw, Trophy } from "lucide-react";
import { speak } from "@/lib/store";
import {
  assessmentAnswerCorrect,
  type AssessmentQuestion,
  type AssessmentScore,
} from "@/lib/assessment";

interface Props {
  makeQuestions: () => AssessmentQuestion[];
  onFinish: (score: AssessmentScore) => void;
  onAnswer?: (wordId: string, correct: boolean) => void;
}

export function Assessment({ makeQuestions, onFinish, onAnswer }: Props) {
  const [questions, setQuestions] = useState(makeQuestions);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState<AssessmentQuestion[]>([]);
  const [showText, setShowText] = useState(false);
  const [usedText, setUsedText] = useState(false);
  const [audioFailed, setAudioFailed] = useState(
    () => typeof window === "undefined" || !("speechSynthesis" in window),
  );
  const locked = useRef(false);
  const submitted = useRef(false);
  const wordOutcomes = useRef(new Map<string, boolean>());
  const heading = useRef<HTMLHeadingElement>(null);
  const q = questions[index];

  useEffect(() => {
    const fail = () => {
      setAudioFailed(true);
      setUsedText(true);
    };
    window.addEventListener("speakup-audio-error", fail);
    return () => window.removeEventListener("speakup-audio-error", fail);
  }, []);
  useEffect(() => {
    heading.current?.focus();
  }, [index]);

  function submit(value: string) {
    if (!q || locked.current) return;
    locked.current = true;
    const ok = assessmentAnswerCorrect(q, value);
    setAnswer(value);
    setFeedback(ok);
    if (ok) setCorrect((n) => n + 1);
    else setMistakes((items) => [...items, q]);
    if (q.wordId) {
      const previous = wordOutcomes.current.get(q.wordId);
      // A later recognition question must not hide a failed recall of the same word.
      if (previous === undefined || (previous && !ok)) {
        wordOutcomes.current.set(q.wordId, ok);
        onAnswer?.(q.wordId, ok);
      }
    }
  }
  function next() {
    setIndex((n) => n + 1);
    setAnswer("");
    setFeedback(null);
    setShowText(false);
    locked.current = false;
  }
  if (!q) {
    const passed = questions.length > 0 && correct / questions.length >= 0.8;
    return (
      <section aria-label="Результат экзамена">
        <div className="result-medallion">
          {passed ? <Trophy aria-hidden="true" /> : <RotateCcw aria-hidden="true" />}
        </div>
        <h2 ref={heading} tabIndex={-1} className="text-2xl font-bold">
          {passed ? "Экзамен сдан" : "Закрепим трудные места"}
        </h2>
        <p className="mt-3 text-xl" role="status">
          {correct} из {questions.length} · {Math.round((correct / questions.length) * 100)}%
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Порог — 80%. Считается первая попытка ответа на каждый вопрос.
        </p>
        {(usedText || audioFailed) && (
          <p className="mt-3 text-sm">
            Часть фраз проверена с текстом. Это не оценка аудирования или произношения.
          </p>
        )}
        {mistakes.length > 0 && (
          <div className="mt-5 space-y-4">
            <h3 className="font-bold">Разбор ошибок</h3>
            {mistakes.map((item) => (
              <div key={item.id} className="rounded-xl bg-muted p-4">
                <p>{item.prompt}</p>
                <p className="mt-2 font-semibold">{item.answer}</p>
                <p className="mt-1 text-sm">{item.explanation}</p>
              </div>
            ))}
            <p className="text-sm">
              Слова с ошибками отправлены в повторение. Перед новой попыткой прочитай объяснения.
            </p>
          </div>
        )}
        <button
          className="btn-primary mt-6 w-full"
          onClick={() => {
            if (submitted.current) return;
            submitted.current = true;
            onFinish({ correct, total: questions.length });
            if (!passed) {
              wordOutcomes.current.clear();
              setQuestions(makeQuestions());
              setIndex(0);
              setCorrect(0);
              setMistakes([]);
              setUsedText(false);
              setAnswer("");
              setFeedback(null);
              setShowText(false);
              locked.current = false;
              submitted.current = false;
            }
          }}
        >
          {passed ? "Завершить экзамен" : "Разобрать и повторить"}
        </button>
      </section>
    );
  }
  return (
    <section aria-label="Экзамен">
      <p className="text-sm text-muted-foreground">
        {q.area} · Вопрос {index + 1} из {questions.length}
      </p>
      <progress
        className="mt-3 w-full accent-primary"
        value={index}
        max={questions.length}
        aria-label="Прогресс экзамена"
      />
      <h2 ref={heading} tabIndex={-1} className="mt-4 text-2xl font-semibold">
        {q.prompt}
      </h2>
      {q.audio && (
        <div className="mt-4 space-y-3">
          {!audioFailed && (
            <button className="btn-ghost w-full" onClick={() => speak(q.audio!)}>
              <Volume2 size={18} aria-hidden="true" />
              Прослушать фразу
            </button>
          )}
          {showText || audioFailed ? (
            <p className="rounded-xl bg-muted p-4">{q.audio}</p>
          ) : (
            <button
              className="btn-ghost w-full"
              onClick={() => {
                setShowText(true);
                setUsedText(true);
              }}
            >
              Не слышу — показать текст
            </button>
          )}
        </div>
      )}
      {q.options ? (
        <div className="mt-5 grid gap-3">
          {q.options.map((option) => (
            <button
              key={option}
              disabled={feedback !== null}
              className="option"
              onClick={() => submit(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <form
          className="mt-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (answer.trim()) submit(answer);
          }}
        >
          <label htmlFor="exam-answer" className="block font-semibold mb-2">
            Ответ на английском
          </label>
          <input
            id="exam-answer"
            className="input-field w-full"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            disabled={feedback !== null}
          />
          {feedback === null && (
            <button className="btn-primary mt-4 w-full" disabled={!answer.trim()}>
              Проверить ответ
            </button>
          )}
        </form>
      )}
      {feedback === null ? (
        <button className="btn-ghost mt-4 w-full" onClick={() => submit("")}>
          Пока не помню
        </button>
      ) : (
        <div className="mt-5 rounded-xl bg-muted p-4" role="status">
          <p className="font-bold">{feedback ? "Верно" : `Правильный ответ: ${q.answer}`}</p>
          <p className="mt-2 text-sm">{q.explanation}</p>
          <button className="btn-primary mt-4 w-full" onClick={next}>
            {index + 1 === questions.length ? "Показать результат" : "Следующий вопрос"}
          </button>
        </div>
      )}
    </section>
  );
}
