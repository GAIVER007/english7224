import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, AudioLines, Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { TeacherHomework } from "@/components/TeacherHomework";
import { WrittenTutor } from "@/components/WrittenTutor";
import { useTutorCall } from "@/hooks/use-tutor-call";
import { useAppState } from "@/lib/store";
import {
  tutorLevels,
  tutorTopics,
  validateTutorSearch,
  type TutorDestination,
  type TutorSettings,
} from "@/lib/tutor";
import { recentHomework } from "@/lib/tutor-written";

export const Route = createFileRoute("/tutor")({
  validateSearch: validateTutorSearch,
  component: TutorPage,
  head: () => ({ meta: [{ title: "Разговор с Mira · SpeakUp" }] }),
});

function TutorPage() {
  const { state, update, ready } = useAppState();
  const call = useTutorCall();
  const { tutor } = Route.useSearch();
  const [selectedTopic, setTopic] = useState<TutorSettings["topic"]>();
  const topic = selectedTopic ?? tutor?.topic ?? tutorTopics[0];
  const [selectedLevel, setLevel] = useState<TutorSettings["level"]>();
  const level = selectedLevel ?? tutor?.level ?? state.pathway?.selected ?? state.level ?? "A1";
  const [choice, setChoice] = useState<Pick<TutorDestination, "assignmentId" | "mode">>();
  const destination = choice ?? tutor;
  const assignmentId = destination?.assignmentId ?? "";
  const selection = { topic, level, ...(assignmentId ? { assignmentId } : {}) };
  const busy = call.phase !== "idle";
  const inMessageLesson = call.matchesLesson(selection);
  const callError = !call.hasMessageLesson || inMessageLesson ? call.error : "";
  const history = useMemo(
    () =>
      Object.entries(state.tutorLessons ?? {}).sort(([, a], [, b]) => b.startedAt - a.startedAt),
    [state.tutorLessons],
  );
  const recent = recentHomework(state.teacherAssignments, history);
  return (
    <main className="app-shell space-y-6">
      <Link to="/" className="inline-flex items-center gap-2">
        <ArrowLeft size={18} /> На главную
      </Link>
      <section className="rounded-3xl bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-4">
          <div
            aria-hidden="true"
            className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
          >
            <AudioLines size={32} />
          </div>
          <div>
            <p className="eyebrow">Голосовой репетитор</p>
            <h1 className="text-3xl font-bold">Разговор с Mira</h1>
          </div>
        </div>
        <TeacherHomework
          selectedId={assignmentId}
          recentId={recent?.id}
          onSelect={(id) => setChoice({ assignmentId: id })}
          onResume={() => {
            if (recent)
              setChoice({
                assignmentId: recent.id,
                ...(recent.written && { mode: "written" as const }),
              });
          }}
          disabled={busy}
        />
        <fieldset disabled={busy} className="flex flex-wrap gap-4">
          {!assignmentId && (
            <label>
              Тема
              <select
                className="block rounded-lg border p-2"
                value={topic}
                onChange={(e) => setTopic(tutorTopics[e.target.selectedIndex]!)}
              >
                {tutorTopics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          )}
          <label>
            Уровень
            <select
              className="block rounded-lg border p-2"
              value={level}
              onChange={(e) => setLevel(tutorLevels[e.target.selectedIndex]!)}
            >
              {tutorLevels.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
        </fieldset>
        <audio ref={call.audio} autoPlay />
        {busy && (
          <p role="status">
            {
              {
                idle: "",
                connecting: "Подключаем микрофон и звоним Mira…",
                connectingAudio: "Mira ответила. Подключаем звук…",
                active: "Звонок идёт",
                finishing: "Готовим итог занятия…",
              }[call.phase]
            }
          </p>
        )}
        {busy && call.caption && <p className="rounded-xl bg-muted p-4">{call.caption}</p>}
        {callError &&
          (inMessageLesson ? (
            <div className="space-y-1">
              <p role="status">Звонок недоступен. Продолжаем голосовыми сообщениями.</p>
              <details className="text-sm text-muted-foreground">
                <summary>Почему не начался звонок</summary>
                <p>{callError}</p>
              </details>
            </div>
          ) : (
            <p role="alert">{callError}</p>
          ))}
        <div className="flex flex-wrap gap-3">
          {!busy && !call.online && (
            <p role="status">
              Для звонка нужен интернет. История занятий доступна на этом устройстве.
            </p>
          )}
          {!busy &&
            call.online &&
            (call.signedIn ? (
              <button
                disabled={!ready || (!!assignmentId && !state.teacherAssignments?.[assignmentId])}
                className="btn-primary"
                onClick={() => call.start(selection)}
              >
                <Phone size={17} /> {assignmentId ? "Разобрать с Mira" : "Начать звонок"}
              </button>
            ) : (
              <Link className="btn-primary" to="/account" search={{ tutor: selection }}>
                Войти для звонка
              </Link>
            ))}
          {call.phase === "active" && (
            <button className="btn-ghost" aria-pressed={call.muted} onClick={call.toggleMute}>
              {call.muted ? <MicOff size={17} /> : <Mic size={17} />}{" "}
              {call.muted ? "Включить микрофон" : "Выключить микрофон"}
            </button>
          )}
          {call.blocked && (
            <button className="btn-ghost" onClick={call.play}>
              Включить звук Mira
            </button>
          )}
          {busy && call.phase !== "finishing" && (
            <button className="btn-primary" onClick={call.finish}>
              <PhoneOff size={17} />
              {call.phase === "active" ? "Завершить звонок" : "Отменить"}
            </button>
          )}
        </div>
        {ready && !busy && (!assignmentId || state.teacherAssignments?.[assignmentId]) && (
          <WrittenTutor
            key={JSON.stringify([call.userId, assignmentId, topic, level])}
            selection={selection}
            assignment={state.teacherAssignments?.[assignmentId]}
            userId={call.userId}
            online={call.online}
            callFailed={!!callError}
            takeOpening={call.takeOpening}
            resumeWritten={destination?.mode === "written"}
          />
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Мои занятия</h2>
        {!history.length && <p>Здесь появятся итоги разговоров и задания Mira.</p>}
        {history.map(([id, lesson]) => (
          <article key={id} className="space-y-2 rounded-2xl border bg-card p-4">
            <small>
              {new Date(lesson.startedAt).toLocaleString("ru")} · {lesson.level}
            </small>
            <h3 className="font-bold">{lesson.assignmentTitle ?? lesson.topic}</h3>
            <p>{lesson.summary}</p>
            {lesson.homework && (
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={lesson.homeworkDone}
                  onChange={(e) => {
                    const done = e.target.checked;
                    update((s) => {
                      const current = s.tutorLessons?.[id];
                      return current
                        ? {
                            ...s,
                            tutorLessons: {
                              ...s.tutorLessons,
                              [id]: { ...current, homeworkDone: done },
                            },
                          }
                        : s;
                    });
                  }}
                />
                <span>
                  <strong>Домашнее задание</strong>
                  <br />
                  {lesson.homework}
                </span>
              </label>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
