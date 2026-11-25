import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getAppState, updateAppState } from "@/lib/store";
import { ownsLocalProgress } from "@/lib/cloud-sync";
import { TutorCall, type CallPhase } from "@/lib/tutor-call";
import type { TutorSettings } from "@/lib/tutor";

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
  const [signedIn, setSignedIn] = useState(false);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [muted, setMuted] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const call = useRef<TutorCall | null>(null);
  const session = useRef<Session | null>(null);
  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((_, next) => {
      if (session.current?.user.id !== next?.user.id)
        call.current?.close("Аккаунт изменился.", false);
      session.current = next;
      setSignedIn(!!next);
    }).data.subscription;
    const close = () => call.current?.close("");
    window.addEventListener("pagehide", close);
    return () => {
      window.removeEventListener("pagehide", close);
      subscription.unsubscribe();
      close();
    };
  }, []);

  function start(settings: TutorSettings) {
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
    const history = Object.values(getAppState().tutorLessons ?? {}).sort(
      (a, b) => b.startedAt - a.startedAt,
    );
    const last = history[0];
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
      ended(message) {
        call.current = null;
        setPhase("idle");
        setBlocked(false);
        setError(message);
      },
      save(id, record) {
        if (session.current?.user.id === account.user.id && ownsLocalProgress(account.user.id))
          updateAppState((s) => ({ ...s, tutorLessons: { ...s.tutorLessons, [id]: record } }));
      },
    });
    call.current = active;
    void active.start(account.access_token, previous);
  }

  return {
    audio,
    phase,
    signedIn,
    online,
    caption,
    error,
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
