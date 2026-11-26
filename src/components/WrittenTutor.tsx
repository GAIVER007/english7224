import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Mic, Volume2 } from "lucide-react";
import { SpeakingRecorder } from "./SpeakingRecorder";
import { transcribeTutorMessage, voiceTutorReply } from "@/lib/tutor-audio.functions";
import { ownsLocalProgress } from "@/lib/cloud-sync";
import { speak, useAppState } from "@/lib/store";
import {
  getSpeechRecognitionConstructor,
  isSpeechSynthesisAvailable,
  type SpeechRecognitionLike,
} from "@/lib/speech";
import {
  writtenMessageLimit,
  writtenHistoryLimit,
  type TeacherAssignment,
  type TutorSelection,
  type WrittenPage,
} from "@/lib/tutor";
import { worksheet } from "@/lib/tutor-written";
import { askWrittenTutor } from "@/lib/tutor-written.functions";

type Props = {
  selection: TutorSelection;
  assignment: TeacherAssignment | undefined;
  userId: string | undefined;
  online: boolean;
};
const emptyPage: WrittenPage = { draft: "", exchanges: [] };

export function WrittenTutor({
  callFailed,
  resumeWritten,
  ...props
}: Props & { callFailed: boolean; resumeWritten: boolean }) {
  const [open, setOpen] = useState(false);
  const [recordingOpen, setRecordingOpen] = useState(false);
  const { update } = useAppState();
  const { assignment, selection } = props;
  const id = selection.assignmentId;
  function openWorkbook(recording: boolean) {
    setOpen(true);
    setRecordingOpen(recording);
    move(assignment?.writtenStep ?? 0);
  }
  const recordButton = props.userId && props.online && (
    <button className="btn-ghost" type="button" onClick={() => openWorkbook(true)}>
      <Mic size={17} /> Голосовое сообщение
    </button>
  );
  if (!open && !callFailed && !resumeWritten)
    return (
      <div className="flex flex-wrap gap-2">
        <button className="btn-ghost" type="button" onClick={() => openWorkbook(false)}>
          <MessageCircle size={17} /> {id ? "Разобрать письменно" : "Написать Mira"}
        </button>
        {recordButton}
      </div>
    );
  const material = assignment && worksheet(assignment.text);
  const count = material?.exercises.length ?? 1;
  const step = Math.min(assignment?.writtenStep ?? 0, count - 1);
  function move(next: number) {
    if (!id || (props.userId && !ownsLocalProgress(props.userId))) return;
    update((s) => {
      const item = s.teacherAssignments?.[id];
      return item
        ? {
            ...s,
            teacherAssignments: {
              ...s.teacherAssignments,
              [id]: { ...item, writtenStep: next, writtenAt: Date.now() },
            },
          }
        : s;
    });
  }
  return (
    <section aria-label="Письменный разбор" className="space-y-3 rounded-2xl border p-4">
      <h2 className="text-lg font-bold">
        {(callFailed || recordingOpen) && props.online && props.userId
          ? "Разговор голосовыми сообщениями"
          : assignment
            ? "Письменный разбор"
            : "Переписка с Mira"}
      </h2>
      {material && (
        <>
          {count > 1 && (
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-ghost" disabled={!step} onClick={() => move(step - 1)}>
                Назад
              </button>
              <span>
                Упражнение {step + 1} из {count}
              </span>
              <button
                className="btn-ghost"
                disabled={step + 1 === count}
                onClick={() => move(step + 1)}
              >
                Дальше
              </button>
            </div>
          )}
          {material.intro && <p className="whitespace-pre-wrap break-words">{material.intro}</p>}
          <p className="max-h-64 overflow-y-auto whitespace-pre-wrap break-words rounded-xl bg-muted p-3">
            {material.exercises[step]}
          </p>
        </>
      )}
      {!recordingOpen && !callFailed && recordButton}
      <WrittenConversation
        key={step}
        {...props}
        step={step}
        showRecorder={recordingOpen || callFailed}
      />
    </section>
  );
}

function WrittenConversation({
  selection,
  assignment,
  userId,
  online,
  step,
  showRecorder,
}: Props & { step: number; showRecorder: boolean }) {
  const { update, storageError } = useAppState();
  const [topicPage, setTopicPage] = useState(emptyPage);
  const [progress, setProgress] = useState("");
  const pending = !!progress;
  const [replyAudio, setReplyAudio] = useState("");
  const player = useRef<HTMLAudioElement>(null);
  const transcripts = useRef(new WeakMap<Blob, string>());
  useEffect(
    () => () => {
      if (replyAudio) URL.revokeObjectURL(replyAudio);
    },
    [replyAudio],
  );
  const [listening, setListening] = useState(false);
  const [notice, setNotice] = useState("");
  const request = useRef<AbortController | null>(null);
  const mic = useRef<SpeechRecognitionLike | null>(null);
  useEffect(
    () => () => {
      request.current?.abort();
      const recognition = mic.current;
      if (recognition) {
        recognition.onend = recognition.onerror = recognition.onresult = null;
        recognition.abort();
      }
    },
    [],
  );
  const id = selection.assignmentId;
  const page = id ? (assignment?.writtenPages?.[step] ?? emptyPage) : topicPage;
  function canWrite() {
    if (!userId || ownsLocalProgress(userId)) return true;
    setNotice("Проверьте синхронизацию прогресса на странице аккаунта.");
    return false;
  }
  function edit(change: (previous: WrittenPage) => WrittenPage) {
    if (!canWrite()) return;
    if (!id) {
      setTopicPage(change);
      return;
    }
    update((s) => {
      const item = s.teacherAssignments?.[id];
      if (!item) return s;
      const next = change(item.writtenPages?.[step] ?? emptyPage);
      return {
        ...s,
        teacherAssignments: {
          ...s.teacherAssignments,
          [id]: {
            ...item,
            writtenAt: Date.now(),
            writtenPages: { ...item.writtenPages, [step]: next },
          },
        },
      };
    });
  }
  async function send(input: string | Blob): Promise<boolean> {
    if (!userId || !online || request.current || !canWrite()) return false;
    const task = new AbortController();
    request.current = task;
    setNotice("");
    let stage = "transcribe";
    try {
      let question: string;
      if (typeof input === "string") {
        question = input.trim();
      } else {
        const cached = transcripts.current.get(input);
        if (cached) {
          question = cached;
        } else {
          setProgress("Распознаём голосовое сообщение…");
          const form = new FormData();
          form.set("audio", input, "message");
          form.set("userId", userId);
          const result = await transcribeTutorMessage({ data: form, signal: task.signal });
          if (task.signal.aborted || !canWrite()) return false;
          if (!result.text) {
            setNotice(result.error ?? "Не удалось распознать речь.");
            return false;
          }
          question = result.text;
          transcripts.current.set(input, question);
          edit((current) => (current.draft ? current : { ...current, draft: question }));
        }
      }
      if (!question || !canWrite()) return false;
      stage = "reply";
      setProgress("Mira готовит ответ…");
      const result = await askWrittenTutor({
        data: {
          topic: selection.topic,
          level: selection.level,
          userId,
          step,
          assignment: assignment && { title: assignment.title, text: assignment.text },
          history: page.exchanges.slice(-4),
          question,
          ...(typeof input !== "string" && { spoken: true as const }),
        },
        signal: task.signal,
      });
      if (task.signal.aborted || !canWrite()) return false;
      if (!result.reply) {
        setNotice(result.error ?? "Mira не прислала ответ.");
        return false;
      }
      const exchange = { question, reply: result.reply };
      edit((current) => ({
        draft: !id && current.draft.trim() === question ? "" : current.draft,
        exchanges: [...current.exchanges, exchange].slice(-writtenHistoryLimit),
      }));
      if (typeof input !== "string") {
        stage = "audio";
        setProgress("Готовим звук…");
        const audio = await voiceTutorReply({
          data: { userId, text: result.reply },
          signal: task.signal,
        });
        if (!audio.ok) throw Error("Audio unavailable");
        const blob = await audio.blob();
        if (!blob.size || !blob.type.startsWith("audio/")) throw Error("Invalid audio");
        if (!task.signal.aborted) setReplyAudio(URL.createObjectURL(blob));
      }
      return true;
    } catch {
      if (!task.signal.aborted) {
        const message =
          stage === "audio"
            ? "Озвучка сейчас недоступна. Ответ Mira уже появился в переписке."
            : stage === "transcribe"
              ? "Не удалось распознать запись. Можно повторить отправку."
              : "Не удалось связаться с Mira. Проверьте интернет и вход в аккаунт, затем повторите отправку.";
        setNotice(message);
      }
      return stage === "audio";
    } finally {
      if (!task.signal.aborted) {
        request.current = null;
        setProgress("");
      }
    }
  }
  const Recognition = getSpeechRecognitionConstructor();
  function dictate() {
    if (!Recognition || mic.current) return;
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = ({ results }) => {
      const words = results[0]?.[0]?.transcript;
      if (words)
        edit((current) => ({
          ...current,
          draft: [current.draft, words].filter(Boolean).join(" ").slice(0, writtenMessageLimit),
        }));
    };
    const stop = () => {
      mic.current = null;
      setListening(false);
    };
    recognition.onend = stop;
    recognition.onerror = () => {
      stop();
      setNotice("Диктовка недоступна. Ответ можно ввести с клавиатуры.");
    };
    try {
      setNotice("");
      mic.current = recognition;
      recognition.start();
      setListening(true);
    } catch {
      stop();
      setNotice("Не удалось включить диктовку. Ответ можно ввести с клавиатуры.");
    }
  }
  return (
    <div className="space-y-3">
      {showRecorder && userId && online && (
        <SpeakingRecorder
          onSend={send}
          busy={pending || listening}
          onStart={() => {
            player.current?.pause();
            setReplyAudio("");
          }}
        />
      )}
      {replyAudio && (
        <div>
          <p className="font-semibold">Голосовой ответ Mira</p>
          <audio
            ref={player}
            controls
            autoPlay
            className="w-full"
            src={replyAudio}
            aria-label="Голосовой ответ Mira"
          />
        </div>
      )}
      {page.exchanges.map(({ question, reply }, index) => (
        <div key={index} className="space-y-1 border-l-2 border-primary pl-3">
          <p className="whitespace-pre-wrap break-words">
            <strong>Вы</strong> · {question}
          </p>
          <p className="whitespace-pre-wrap break-words">
            <strong>Mira</strong> · {reply}
          </p>
          {isSpeechSynthesisAvailable() && (
            <button
              className="btn-ghost"
              onClick={() => speak(reply, 0.94, /[а-яё]/i.test(reply) ? "ru-RU" : "en-US")}
            >
              <Volume2 size={16} /> Озвучить ответ
            </button>
          )}
        </div>
      ))}
      <label className="block font-medium">
        {id ? "Ваш ответ или вопрос по упражнению" : "Сообщение для Mira"}
        <textarea
          className="mt-1 block w-full rounded-lg border p-3"
          rows={3}
          maxLength={writtenMessageLimit}
          value={page.draft}
          onChange={(e) => {
            const draft = e.target.value;
            edit((p) => ({ ...p, draft }));
          }}
        />
      </label>
      {id && (
        <p className="text-sm text-muted-foreground">
          {storageError
            ? "Не удалось записать изменения на устройство."
            : "Черновик сохраняется в этом задании автоматически."}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {Recognition && (
          <button className="btn-ghost" onClick={listening ? () => mic.current?.abort() : dictate}>
            {listening ? "Остановить диктовку" : "Продиктовать по-английски"}
          </button>
        )}
        {online && userId && (
          <>
            <button
              className="btn-primary"
              disabled={pending || !page.draft.trim()}
              onClick={() => void send(page.draft)}
            >
              Отправить Mira
            </button>
            {assignment && (
              <button
                className="btn-ghost"
                disabled={pending}
                onClick={() => void send("Дай подсказку к этому упражнению.")}
              >
                Подсказка Mira
              </button>
            )}
          </>
        )}
        {online && !userId && (
          <Link
            className="btn-ghost"
            to="/account"
            search={{ tutor: { ...selection, mode: "written" } }}
          >
            Войти для ответа Mira
          </Link>
        )}
      </div>
      {!online && <p>Для ответа Mira нужен интернет.</p>}
      {pending && <p role="status">{progress}</p>}
      {notice && <p role="alert">{notice}</p>}
    </div>
  );
}
