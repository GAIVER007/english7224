import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Eye, RotateCcw } from "lucide-react";

import type { Word } from "@/lib/content";
import { shuffle } from "@/lib/learning";
import { isRecallAnswerCorrect } from "@/lib/recall";

interface RecallPracticeProps {
  words: Word[];
  onAnswer: (id: string, correct: boolean) => void;
  onDone: () => void;
}

interface RecallItem {
  word: Word;
  originalNumber: number;
  isRetry: boolean;
}

interface Feedback {
  correct: boolean;
  revealed: boolean;
}

export function RecallPractice({ words, onAnswer, onDone }: RecallPracticeProps) {
  const [originals] = useState(() => shuffle(words).slice(0, 5));
  const [queue, setQueue] = useState<RecallItem[]>(() =>
    originals.map((word, index) => ({ word, originalNumber: index + 1, isRetry: false })),
  );
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [missedIds, setMissedIds] = useState<Set<string>>(() => new Set());
  const reportedIds = useRef(new Set<string>());
  const answerLocked = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = queue[index];

  useEffect(() => {
    if (current && feedback === null) inputRef.current?.focus();
  }, [current, feedback]);

  function recordResult(correct: boolean, revealed: boolean) {
    if (!current || answerLocked.current) return;
    answerLocked.current = true;
    setFeedback({ correct, revealed });

    if (!current.isRetry && !reportedIds.current.has(current.word.id)) {
      reportedIds.current.add(current.word.id);
      onAnswer(current.word.id, correct);
      if (correct) setFirstTryCorrect((value) => value + 1);
      else setMissedIds((ids) => new Set(ids).add(current.word.id));
    }

    if (!correct) {
      setQueue((items) => [
        ...items,
        { word: current.word, originalNumber: current.originalNumber, isRetry: true },
      ]);
    }
  }

  function checkAnswer() {
    if (!current || feedback !== null || answer.trim().length === 0) return;
    recordResult(isRecallAnswerCorrect(answer, current.word.en), false);
  }

  function continuePractice() {
    setAnswer("");
    setFeedback(null);
    answerLocked.current = false;
    setIndex((value) => value + 1);
  }

  if (originals.length === 0) {
    return (
      <section className="recall-practice" aria-labelledby="recall-empty-title">
        <div className="result-medallion" aria-hidden="true">
          <Check />
        </div>
        <h2 id="recall-empty-title" className="mt-4 text-2xl font-semibold">
          Сначала изучим слова
        </h2>
        <p className="mt-2 text-muted-foreground">
          Здесь появятся слова из твоих уроков. Пройди первый — и возвращайся за короткой
          тренировкой.
        </p>
        <button className="btn-primary mt-6 w-full" type="button" onClick={onDone}>
          Готово
        </button>
      </section>
    );
  }

  if (!current) {
    const perfect = missedIds.size === 0;
    return (
      <section className="text-center" aria-labelledby="recall-result-title">
        <div className="result-medallion" aria-hidden="true">
          {perfect ? <Check /> : <RotateCcw />}
        </div>
        <h2 id="recall-result-title" className="mt-4 text-2xl font-semibold">
          {perfect ? "Отлично закреплено!" : "Есть что повторить — и это нормально"}
        </h2>
        <p className="mt-3" role="status">
          С первой попытки: {firstTryCorrect} из {originals.length}.
          {perfect
            ? " Все слова уверенно вспоминаются."
            : ` Ты потренировал ${missedIds.size} ${missedIds.size === 1 ? "слово" : "слова"} ещё раз.`}
        </p>
        <button className="btn-primary mt-6 w-full" type="button" onClick={onDone}>
          Завершить практику
        </button>
      </section>
    );
  }

  const inputId = `recall-answer-${current.word.id}`;

  return (
    <section className="recall-practice" aria-labelledby="recall-question-title">
      <p className="text-sm text-muted-foreground">
        {current.isRetry ? "Повторяем ошибку" : `${current.originalNumber} из ${originals.length}`}
      </p>
      <h2 id="recall-question-title" className="mt-2 text-2xl font-semibold">
        Как это будет по-английски?
      </h2>
      <p className="mt-4 text-3xl font-semibold">{current.word.ru}</p>

      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          checkAnswer();
        }}
      >
        <label className="mb-2 block font-medium" htmlFor={inputId}>
          Твой ответ на английском
        </label>
        <input
          ref={inputRef}
          id={inputId}
          className="input-field w-full"
          value={answer}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          disabled={feedback !== null}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Введи слово или выражение"
        />

        {feedback === null ? (
          <div className="mt-5 grid gap-3">
            <button
              className="btn-primary w-full"
              type="submit"
              disabled={answer.trim().length === 0}
            >
              Проверить
            </button>
            <button
              className="btn-ghost w-full"
              type="button"
              onClick={() => recordResult(false, true)}
            >
              <Eye aria-hidden="true" />
              Показать ответ
            </button>
          </div>
        ) : (
          <div
            className={`quiz-feedback flex-col mt-5 ${feedback.correct ? "correct" : "incorrect"}`}
            aria-live="polite"
          >
            <p className="font-semibold">
              {feedback.correct
                ? "Верно! Вспомнил самостоятельно."
                : feedback.revealed
                  ? `Ответ: ${current.word.en}`
                  : `Пока нет. Правильный ответ: ${current.word.en}`}
            </p>
            <p className="mt-3 font-medium">{current.word.example}</p>
            <p className="mt-1 text-sm text-muted-foreground">{current.word.exampleRu}</p>
            <button className="btn-primary mt-5 w-full" type="button" onClick={continuePractice}>
              Продолжить
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        )}
      </form>
    </section>
  );
}
