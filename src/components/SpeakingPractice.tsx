import { useCallback, useEffect, useRef, useState } from "react";

import { Mic, Volume2 } from "lucide-react";
import { speak } from "@/lib/store";
import {
  compareSpeechText,
  getSpeechRecognitionConstructor,
  isSpeechSynthesisAvailable,
  speechRecognitionErrorMessage,
  type SpeechRecognitionLike,
} from "@/lib/speech";

interface SpeakingPracticeProps {
  items: { prompt: string; target: string }[];
  onDone: () => void;
}

type Feedback =
  { type: "match" | "mismatch"; transcript: string } | { type: "error"; message: string } | null;

export function SpeakingPractice({ items, onDone }: SpeakingPracticeProps) {
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [selfPracticed, setSelfPracticed] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [recognitionBlocked, setRecognitionBlocked] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const Recognition = getSpeechRecognitionConstructor();
  const recognitionAvailable = Recognition !== null && !recognitionBlocked;
  const audioAvailable = isSpeechSynthesisAvailable();
  const item = items[index];

  const abortRecognition = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    recognition.abort();
    recognitionRef.current = null;
  }, []);

  useEffect(() => abortRecognition, [abortRecognition]);

  if (!item) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Упражнения на сегодня закончились.</p>
        <button className="btn-primary mt-6 min-h-11" onClick={onDone}>
          Завершить
        </button>
      </div>
    );
  }

  const resetAttempt = () => {
    setListening(false);
    setAttempted(false);
    setSelfPracticed(false);
    setFeedback(null);
  };

  const startRecognition = () => {
    if (!Recognition || recognitionBlocked) return;

    abortRecognition();
    resetAttempt();

    const recognition = new Recognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim() ?? "";
      setAttempted(true);
      setFeedback({
        type: compareSpeechText(transcript, item.target).matches ? "match" : "mismatch",
        transcript,
      });
    };
    recognition.onerror = (event) => {
      if (event.error === "aborted") return;
      setAttempted(true);
      setListening(false);
      setFeedback({ type: "error", message: speechRecognitionErrorMessage(event.error) });
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setRecognitionBlocked(true);
      }
    };
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
      setListening(true);
    } catch {
      recognitionRef.current = null;
      setAttempted(true);
      setFeedback({
        type: "error",
        message:
          "Не удалось запустить микрофон. Попробуйте ещё раз или выполните задание самостоятельно.",
      });
    }
  };

  const advance = () => {
    if (!attempted && !selfPracticed) return;
    abortRecognition();
    if (index + 1 < items.length) {
      setIndex((current) => current + 1);
      resetAttempt();
      return;
    }
    onDone();
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {index + 1} / {items.length}
      </p>
      <h2 className="mt-2 text-3xl font-semibold">{item.prompt}</h2>

      <div className="mt-5 rounded-xl bg-muted p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Скажите по-английски
        </p>
        <p className="mt-1 text-xl font-semibold">{item.target}</p>
      </div>

      <button
        className="btn-ghost mt-4 min-h-11"
        onClick={() => speak(item.target)}
        aria-label={`Прослушать: ${item.target}`}
        aria-describedby={!audioAvailable ? "speech-audio-status" : undefined}
        disabled={!audioAvailable}
      >
        <Volume2 size={18} aria-hidden="true" /> Послушать фразу
      </button>
      {!audioAvailable && (
        <p id="speech-audio-status" className="mt-2 text-sm text-muted-foreground">
          Озвучивание недоступно в этом браузере.
        </p>
      )}

      {recognitionAvailable ? (
        <>
          <p className="mt-6 text-sm text-muted-foreground">
            Распознавание запускается только по кнопке. Браузер может передавать аудио своему
            сервису распознавания речи.
          </p>
          <button
            className="btn-primary mt-3 min-h-11 w-full"
            onClick={startRecognition}
            disabled={listening}
          >
            <Mic size={20} aria-hidden="true" />
            {listening ? "Слушаю…" : attempted ? "Попробовать ещё раз" : "Начать запись"}
          </button>
        </>
      ) : (
        <p className="mt-6 rounded-xl bg-muted p-4 text-sm" role="status">
          Распознавание речи недоступно в этом браузере. Прослушайте фразу, произнесите её вслух и
          подтвердите выполнение ниже.
        </p>
      )}

      <div aria-live="polite" aria-atomic="true">
        {feedback?.type === "error" && (
          <p className="mt-4 rounded-xl bg-muted p-4 text-sm text-destructive" role="alert">
            {feedback.message}
          </p>
        )}
        {(feedback?.type === "match" || feedback?.type === "mismatch") && (
          <div
            className={`mt-4 rounded-xl p-4 ${feedback.type === "match" ? "bg-accent text-accent-foreground" : "bg-muted"}`}
          >
            <p className="text-sm text-muted-foreground">Распознано:</p>
            <p className="font-semibold">{feedback.transcript || "Речь не распознана"}</p>
            <p className="mt-2 text-sm">
              {feedback.type === "match"
                ? "Текст фразы совпал. Это приблизительная проверка текста, а не оценка произношения."
                : "Фраза распознана не полностью. Сравните с образцом и попробуйте ещё раз."}
            </p>
          </div>
        )}
      </div>

      <label className="mt-6 flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-3">
        <input
          type="checkbox"
          className="h-5 w-5"
          checked={selfPracticed}
          onChange={(event) => setSelfPracticed(event.target.checked)}
        />
        <span className="text-sm font-semibold">Я произнёс фразу самостоятельно</span>
      </label>

      <button
        className="btn-primary mt-6 min-h-11 w-full"
        onClick={advance}
        disabled={!attempted && !selfPracticed}
      >
        {index + 1 < items.length ? "Дальше" : "Завершить"}
      </button>
    </div>
  );
}
