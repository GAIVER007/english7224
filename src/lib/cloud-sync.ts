import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { getAppState, onAppStateChange, restoreAppState, type AppState } from "./store";

export type SyncStatus = "off" | "loading" | "saving" | "saved" | "error";
let status: SyncStatus = "off";
const listeners = new Set<(s: SyncStatus) => void>();
function setStatus(next: SyncStatus) {
  status = next;
  listeners.forEach((l) => l(next));
}
export function getSyncStatus() {
  return status;
}
export function onSyncStatus(l: (s: SyncStatus) => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** Cloud copy wins when it holds at least as much progress; otherwise the device copy is uploaded. */
export function pickState(local: AppState, cloud: AppState | null): "cloud" | "local" {
  if (!cloud) return "local";
  const score = (s: AppState) => s.xp * 1000 + (s.resultHistory?.length ?? 0);
  return score(cloud) >= score(local) ? "cloud" : "local";
}

let userId: string | null = null;
let stopListening: (() => void) | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let applyingRemote = false;

async function upload() {
  if (!userId) return;
  setStatus("saving");
  const { error } = await supabase.from("user_progress").upsert({
    user_id: userId,
    state: getAppState() as unknown as Json,
    updated_at: new Date().toISOString(),
  });
  setStatus(error ? "error" : "saved");
}

export async function startSync(id: string) {
  if (userId === id) return;
  stopSync();
  userId = id;
  setStatus("loading");
  const { data, error } = await supabase
    .from("user_progress")
    .select("state")
    .eq("user_id", id)
    .maybeSingle();
  if (error || userId !== id) return setStatus("error");
  const cloud = (data?.state as unknown as AppState | undefined) ?? null;
  if (cloud && pickState(getAppState(), cloud) === "cloud") {
    try {
      applyingRemote = true;
      restoreAppState(cloud);
    } catch {
      /* corrupt cloud copy: keep device progress and overwrite it */
    } finally {
      applyingRemote = false;
    }
  }
  await upload();
  stopListening = onAppStateChange(() => {
    if (applyingRemote) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => void upload(), 800);
  });
  window.addEventListener("pagehide", flush);
}

function flush() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
    void upload();
  }
}

export function stopSync() {
  flush();
  stopListening?.();
  stopListening = null;
  userId = null;
  window.removeEventListener("pagehide", flush);
  setStatus("off");
}
