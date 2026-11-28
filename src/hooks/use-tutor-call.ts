import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getAppState, updateAppState } from "@/lib/store";
import { ownsLocalProgress } from "@/lib/cloud-sync";
import { TutorCall, type CallPhase } from "@/lib/tutor-call";
import { tutorContinuation, type TutorSelection } from "@/lib/tutor";
import { assignmentForCall, worksheet, type LessonOpening } from "@/lib/tutor-written";

function subscribeToNetwork(notify: () => void) {
  window.addEventListener("online", notify);
  window.addEventListener("offline", notify);
  return () => {
    window.removeEventListener("online", notify);
    window.removeEventListener("offline", notify);
  };
}

export function useTutorCall() {
  const online = useSyncExternalStore(
    subscribeToNetwork,
    () => navigator.onLine,
    () => true,
  );
  const [phase, setPhase] = useState<CallPhase>("idle");
  const [userId, setUserId] = useState<string>();
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [muted, setMuted] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const call = useRef<TutorCall | null>(null);
  const session = useRef<Session | null>(null);
  const [messageLesson, setMessageLesson] = useState<{
    selection: TutorSelection;
    userId: string;
    step: number;
    opening: LessonOpening;
  }>();
  const openingClaimed = useRef(false);
  function matchesLesson(selection: TutorSelection) {
    return (
      !!messageLesson &&
      messageLesson.userId === userId &&
      messageLesson.selection.assignmentId === selection.assignmentId &&
      messageLesson.selection.topic === selection.topic &&
      messageLesson.selection.level === selection.level
    );
  }
  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((_, next) => {
      if (session.current?.user.id !== next?.user.id) {
        setMessageLesson(undefined);
        call.current?.close("Аккаунт изменился.", false);
      }
      session.current = next;
      setUserId(next?.user.id);
    }).data.subscription;
    const close = () => call.current?.close("");
    window.addEventListener("pagehide", close);
    return () => {
      window.removeEventListener("pagehide", close);
      subscription.unsubscribe();
      close();
    };
  }, []);

  function start({ assignmentId, ...settings }: TutorSelection) {
    setMessageLesson(undefined);
    if (!navigator.onLine) {
      setError("Для звонка нужен интернет.");
      return;
    }
    const account = session.current;
    if (!account || !audio.current || call.current) return;
    if (!ownsLocalProgress(account.user.id)) {
      setError("Проверьте синхронизацию прогресса на странице аккаунта.");
      return;
    }
    const state = getAppState();
    const assignment = assignmentId ? state.teacherAssignments?.[assignmentId] : undefined;
    if (assignmentId && !assignment) {
      setError("Задание больше не доступно. Выберите другое задание.");
      return;
    }
    const { last, checkpoint } = tutorContinuation(state.tutorLessons, assignmentId);
    const material = assignment && assignmentForCall(assignment, last?.startedAt, checkpoint);
    const previous = last
      ? [
          last.summary,
          last.homework &&
            (last.homeworkDone ? "Выполнено: " : "К следующему занятию: ") + last.homework,
        ]
          .filter(Boolean)
          .join("\n")
      : "";
    setError("");
    setCaption("");
    setMuted(false);
    setBlocked(false);
    setPhase("connecting");
    const active = new TutorCall(settings, audio.current, {
      phase: setPhase,
      caption: setCaption,
      playbackBlocked: setBlocked,
      startMessages() {
        const step = assignment
          ? Math.min(assignment.writtenStep ?? 0, worksheet(assignment.text).exercises.length - 1)
          : 0;
        openingClaimed.current = false;
        setMessageLesson({
          selection: { ...settings, assignmentId },
          userId: account.user.id,
          step,
          opening: {
            resumeFrom: material?.resumeFrom,
            draft: assignment?.writtenPages?.[step]?.draft,
          },
        });
      },
      ended(message) {
        call.current = null;
        setPhase("idle");
        setBlocked(false);
        setError(message);
      },
      save(id, record) {
        if (session.current?.user.id === account.user.id && ownsLocalProgress(account.user.id))
          updateAppState((s) => ({
            ...s,
            tutorLessons: {
              ...s.tutorLessons,
              [id]: assignment
                ? { ...record, assignmentId, assignmentTitle: assignment.title }
                : record,
            },
          }));
      },
    });
    call.current = active;
    void active.start(
      async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session || data.session.user.id !== account.user.id)
          throw Error("Войдите в аккаунт, чтобы начать звонок.");
        return data.session.access_token;
      },
      previous,
      material,
    );
  }

  return {
    audio,
    phase,
    signedIn: !!userId,
    userId,
    online,
    caption,
    error,
    hasMessageLesson: !!messageLesson,
    matchesLesson,
    takeOpening(selection: TutorSelection, step: number) {
      if (
        !messageLesson ||
        openingClaimed.current ||
        !matchesLesson(selection) ||
        step !== messageLesson.step ||
        session.current?.user.id !== messageLesson.userId
      )
        return;
      openingClaimed.current = true;
      return messageLesson.opening;
    },
    muted,
    blocked,
    start,
    finish: () => call.current?.finish(),
    play: () => call.current?.play(),
    toggleMute: () => {
      call.current?.mute(!muted);
      setMuted(!muted);
    },
  };
}
