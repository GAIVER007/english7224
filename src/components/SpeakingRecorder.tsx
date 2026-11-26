import { useCallback, useEffect, useRef, useState } from "react";

import { Mic, RotateCcw, Square } from "lucide-react";

const MAX_RECORDING_SECONDS = 120;
const MAX_RECORDING_BYTES = 12 * 1024 * 1024;

type RecorderStatus = "idle" | "requesting" | "recording" | "processing" | "ready" | "error";

interface SpeakingRecorderProps {
  model?: string;
  onRecorded?: (seconds: number) => void;
  onSend?: (recording: Blob) => Promise<boolean>;
  busy?: boolean;
  onStart?: () => void;
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function permissionErrorMessage(error: unknown) {
  if (error instanceof DOMException && ["NotAllowedError", "SecurityError"].includes(error.name)) {
    return "Доступ к микрофону запрещён. Разрешите его в настройках браузера и попробуйте снова.";
  }
  if (error instanceof DOMException && error.name === "NotFoundError") {
    return "Микрофон не найден. Подключите его и попробуйте снова.";
  }
  return "Не удалось включить микрофон. Проверьте разрешение браузера и попробуйте снова.";
}

export function SpeakingRecorder({
  model,
  onRecorded,
  onSend,
  busy,
  onStart,
}: SpeakingRecorderProps) {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const requestRef = useRef(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);
  const audioUrlRef = useRef<string | null>(null);
  const recording = useRef<Blob | null>(null);
  const onRecordedRef = useRef(onRecorded);

  const supported =
    typeof navigator !== "undefined" &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof MediaRecorder !== "undefined";

  useEffect(() => {
    onRecordedRef.current = onRecorded;
  }, [onRecorded]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const releaseStream = useCallback(() => {
    stopStream(streamRef.current);
    streamRef.current = null;
  }, []);

  const revokeAudio = useCallback(() => {
    recording.current = null;
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    clearTimer();
    if (mountedRef.current) setStatus("processing");
    try {
      recorder.stop();
    } catch {
      releaseStream();
      recorderRef.current = null;
      if (mountedRef.current) {
        setStatus("error");
        setError("Не удалось завершить запись. Попробуйте ещё раз.");
      }
    }
  }, [clearTimer, releaseStream]);

  const startRecording = async () => {
    if (
      !supported ||
      status === "requesting" ||
      status === "recording" ||
      status === "processing"
    ) {
      return;
    }

    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    setStatus("requesting");
    setError(null);
    onStart?.();

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch (requestError) {
      if (mountedRef.current && requestRef.current === requestId) {
        setStatus("error");
        setError(permissionErrorMessage(requestError));
      }
      return;
    }

    if (!mountedRef.current || requestRef.current !== requestId) {
      stopStream(stream);
      return;
    }

    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream);
    } catch {
      stopStream(stream);
      setStatus("error");
      setError("Этот браузер не смог начать запись. Попробуйте другой браузер или устройство.");
      return;
    }

    const chunks: Blob[] = [];
    let totalBytes = 0;
    let failure: string | null = null;
    let finalized = false;

    const finalizeRecording = () => {
      if (finalized) return;
      finalized = true;
      clearTimer();
      stopStream(stream);
      if (streamRef.current === stream) streamRef.current = null;
      if (recorderRef.current === recorder) recorderRef.current = null;
      if (!mountedRef.current) return;

      if (failure) {
        setStatus("error");
        setError(failure);
        return;
      }

      const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
      if (!blob.size) {
        setStatus("error");
        setError("Запись не содержит звука. Проверьте микрофон и попробуйте снова.");
        return;
      }

      const duration = Math.min(
        MAX_RECORDING_SECONDS,
        Math.max(1, Math.ceil((Date.now() - startedAtRef.current) / 1000)),
      );
      const nextUrl = URL.createObjectURL(blob);
      revokeAudio();
      recording.current = blob;
      audioUrlRef.current = nextUrl;
      setAudioUrl(nextUrl);
      setSeconds(duration);
      setStatus("ready");
      onRecordedRef.current?.(duration);
    };

    recorder.ondataavailable = (event) => {
      if (!event.data.size || failure) return;
      totalBytes += event.data.size;
      if (totalBytes > MAX_RECORDING_BYTES) {
        failure = "Запись получилась слишком большой. Сделайте более короткую попытку.";
        stopRecording();
        return;
      }
      chunks.push(event.data);
    };
    recorder.onerror = () => {
      failure = "Во время записи произошла ошибка. Попробуйте ещё раз.";
      if (recorder.state === "inactive") finalizeRecording();
      else stopRecording();
    };
    recorder.onstop = finalizeRecording;

    try {
      recorder.start(1000);
    } catch {
      recorder.ondataavailable = null;
      recorder.onerror = null;
      recorder.onstop = null;
      stopStream(stream);
      setStatus("error");
      setError("Не удалось начать запись. Попробуйте ещё раз.");
      return;
    }

    revokeAudio();
    setAudioUrl(null);
    streamRef.current = stream;
    recorderRef.current = recorder;
    startedAtRef.current = Date.now();
    setSeconds(0);
    setStatus("recording");

    timerRef.current = setInterval(() => {
      const elapsed = Math.min(
        MAX_RECORDING_SECONDS,
        Math.floor((Date.now() - startedAtRef.current) / 1000),
      );
      if (mountedRef.current) setSeconds(elapsed);
      if (elapsed >= MAX_RECORDING_SECONDS) stopRecording();
    }, 250);
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      requestRef.current += 1;
      clearTimer();
      const recorder = recorderRef.current;
      recorderRef.current = null;
      if (recorder) {
        recorder.ondataavailable = null;
        recorder.onerror = null;
        recorder.onstop = null;
        if (recorder.state !== "inactive") {
          try {
            recorder.stop();
          } catch {
            // The stream is still released below.
          }
        }
      }
      releaseStream();
      revokeAudio();
    };
  }, [clearTimer, releaseStream, revokeAudio]);

  return (
    <section className="mt-5 rounded-2xl border border-border bg-card p-4" aria-label="Моя запись">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-bold">
            {onSend ? "Голосовое сообщение для Mira" : "Запишите свой ответ"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {onSend
              ? "Запишите до двух минут и отправьте. Mira ответит голосом."
              : "До 2 минут. Аудио остаётся только на этом экране и не отправляется в интернет."}
          </p>
        </div>
        {status === "recording" && (
          <span
            className="shrink-0 font-mono text-sm font-bold tabular-nums text-destructive"
            role="timer"
          >
            {formatDuration(seconds)}
          </span>
        )}
      </div>

      {!supported ? (
        <p className="mt-4 rounded-xl bg-muted p-4 text-sm" role="status">
          {onSend
            ? "Запись звука недоступна в этом браузере. Можно написать Mira ниже."
            : "Запись звука недоступна в этом браузере. Произнесите ответ вслух и сравните его с образцом ниже."}
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {status === "recording" ? (
            <button type="button" className="btn-primary min-h-12 w-full" onClick={stopRecording}>
              <Square size={20} aria-hidden="true" /> Остановить запись
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary min-h-12 w-full"
              onClick={startRecording}
              disabled={busy || status === "requesting" || status === "processing"}
              aria-busy={status === "requesting" || status === "processing"}
            >
              {status === "ready" ? (
                <RotateCcw size={20} aria-hidden="true" />
              ) : (
                <Mic size={20} aria-hidden="true" />
              )}
              {status === "requesting"
                ? "Ожидаю доступ…"
                : status === "processing"
                  ? "Готовлю аудио…"
                  : status === "ready"
                    ? "Записать заново"
                    : "Начать запись"}
            </button>
          )}
        </div>
      )}

      <div aria-live="polite" aria-atomic="true">
        {status === "recording" && (
          <p className="mt-3 text-sm text-muted-foreground" role="status">
            Идёт запись. Говорите в обычном темпе.
          </p>
        )}
        {error && (
          <p className="mt-3 rounded-xl bg-muted p-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>

      {audioUrl && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold">Ваша попытка · {formatDuration(seconds)}</p>
          <audio className="w-full" controls src={audioUrl} aria-label="Воспроизвести мою запись" />
          {onSend && (
            <button
              className="btn-primary mt-3"
              disabled={busy || status !== "ready"}
              onClick={async () => {
                const current = recording.current;
                if (
                  current &&
                  (await onSend(current)) &&
                  mountedRef.current &&
                  recording.current === current
                ) {
                  revokeAudio();
                  setAudioUrl(null);
                  setStatus("idle");
                }
              }}
            >
              Отправить запись Mira
            </button>
          )}
        </div>
      )}

      {model && (
        <details className="mt-4 rounded-xl bg-muted px-4 py-3">
          <summary className="min-h-11 cursor-pointer py-2 font-semibold">
            Как проверить себя
          </summary>
          <div className="pb-1 text-sm">
            <p className="font-semibold">Образец ответа</p>
            <p className="mt-1 text-muted-foreground" lang="en">
              {model}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Я передал основную мысль и ответил по теме.</li>
              <li>Я проверил порядок слов, времена и ключевые выражения.</li>
              <li>Речь звучит понятно, без слишком длинных пауз.</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Это самостоятельное сравнение, а не автоматическая оценка произношения.
            </p>
          </div>
        </details>
      )}
    </section>
  );
}
