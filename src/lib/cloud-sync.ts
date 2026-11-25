import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import {
  createInitialState,
  getAppState,
  onAppStateChange,
  restoreAppState,
  validateAppStateForImport,
  type AppState,
} from "./store";
import { mergeAppStates, syncValuesEqual, type SyncMergeConflict } from "./sync-merge";

export type SyncStatus = "off" | "loading" | "saving" | "saved" | "conflict" | "error";

interface RemoteProgress {
  state: AppState;
  updatedAt: string;
}

interface InternalConflict {
  choices: SyncMergeConflict;
  remote: AppState;
}

interface SyncSession {
  id: string;
  generation: number;
  baseline: AppState;
  dirty: boolean;
  running: Promise<void> | null;
  timer: ReturnType<typeof setTimeout> | null;
  applyingRemote: boolean;
  ownerBlocked: boolean;
  resolving: boolean;
  conflict: InternalConflict | null;
  stopStore: (() => void) | null;
  online: () => void;
  focus: () => void;
}

const BASELINE_PREFIX = "speakup-sync-baseline-v1:";
const OWNER_KEY = "speakup-sync-owner-v1";
const MAX_CAS_ATTEMPTS = 3;
let status: SyncStatus = "off";
let generation = 0;
let session: SyncSession | null = null;
const listeners = new Set<(next: SyncStatus) => void>();

function setStatus(next: SyncStatus, target?: SyncSession) {
  if (target && !isCurrent(target)) return;
  status = next;
  listeners.forEach((listener) => listener(next));
}

export function getSyncStatus() {
  return status;
}

export function onSyncStatus(listener: (next: SyncStatus) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSyncConflict(): SyncMergeConflict | null {
  return session?.conflict?.choices ?? null;
}

function isCurrent(target: SyncSession) {
  return session === target && target.generation === generation;
}

function baselineKey(id: string) {
  return `${BASELINE_PREFIX}${id}`;
}

function loadBaseline(id: string): AppState {
  if (typeof window === "undefined") return createInitialState();
  try {
    const raw = window.localStorage.getItem(baselineKey(id));
    return raw ? validateAppStateForImport(JSON.parse(raw)) : createInitialState();
  } catch {
    return createInitialState();
  }
}

function saveBaseline(target: SyncSession, state: AppState) {
  if (!isCurrent(target) || typeof window === "undefined") return;
  window.localStorage.setItem(baselineKey(target.id), JSON.stringify(state));
  window.localStorage.setItem(OWNER_KEY, target.id);
  target.baseline = state;
}

function checkOwnership(target: SyncSession) {
  if (typeof window === "undefined") {
    target.ownerBlocked = false;
    return;
  }
  let owner = window.localStorage.getItem(OWNER_KEY);
  if (!owner) {
    window.localStorage.setItem(OWNER_KEY, target.id);
    owner = target.id;
  }
  target.ownerBlocked = owner !== target.id;
}

export function ownsLocalProgress(id: string): boolean {
  try {
    return window.localStorage.getItem(OWNER_KEY) === id;
  } catch {
    return false;
  }
}

function claimOwnership(target: SyncSession) {
  if (typeof window !== "undefined") window.localStorage.setItem(OWNER_KEY, target.id);
  target.ownerBlocked = false;
}

function setOwnershipConflict(target: SyncSession, cloud: AppState) {
  target.conflict = {
    choices: {
      local: validateAppStateForImport(getAppState()),
      cloud,
      reason: "account-change",
    },
    remote: cloud,
  };
  setStatus("conflict", target);
}

function nextTimestamp(previous?: string) {
  const now = Date.now();
  const prior = previous ? Date.parse(previous) : 0;
  return new Date(Math.max(now, Number.isFinite(prior) ? prior + 1 : now)).toISOString();
}

async function readRemote(target: SyncSession): Promise<RemoteProgress | null> {
  const { data, error } = await supabase
    .from("user_progress")
    .select("state, updated_at")
    .eq("user_id", target.id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    state: validateAppStateForImport(data.state),
    updatedAt: data.updated_at,
  };
}

async function insertRemote(target: SyncSession, state: AppState): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_progress")
    .insert({
      user_id: target.id,
      state: state as unknown as Json,
      updated_at: nextTimestamp(),
    })
    .select("updated_at")
    .maybeSingle();
  return !error && Boolean(data);
}

async function updateRemote(
  target: SyncSession,
  state: AppState,
  expectedUpdatedAt: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_progress")
    .update({
      state: state as unknown as Json,
      updated_at: nextTimestamp(expectedUpdatedAt),
    })
    .eq("user_id", target.id)
    .eq("updated_at", expectedUpdatedAt)
    .select("updated_at")
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

function restoreMerged(target: SyncSession, state: AppState) {
  if (!isCurrent(target) || syncValuesEqual(getAppState(), state)) return;
  target.applyingRemote = true;
  try {
    restoreAppState(state);
  } finally {
    target.applyingRemote = false;
  }
}

async function syncOnce(target: SyncSession): Promise<"done" | "retry" | "conflict"> {
  // Fail closed if browser storage is unavailable: without an owner marker we
  // cannot prove that this working copy belongs to the signed-in account.
  checkOwnership(target);
  const remote = await readRemote(target);
  if (!isCurrent(target)) return "done";
  checkOwnership(target);
  // Read after network I/O so an edit made while the request was pending is
  // part of this merge and cannot be replaced by an older snapshot.
  const local = validateAppStateForImport(getAppState());
  const cloud = remote?.state ?? createInitialState();
  if (target.ownerBlocked) {
    setOwnershipConflict(target, cloud);
    return "conflict";
  }
  const result = mergeAppStates(target.baseline, local, cloud);
  if (result.conflict) {
    target.conflict = { choices: result.conflict, remote: cloud };
    setStatus("conflict", target);
    return "conflict";
  }

  const merged = validateAppStateForImport(result.state);
  checkOwnership(target);
  if (target.ownerBlocked) {
    setOwnershipConflict(target, cloud);
    return "conflict";
  }
  restoreMerged(target, merged);
  if (!isCurrent(target)) return "done";

  checkOwnership(target);
  if (target.ownerBlocked) {
    setOwnershipConflict(target, cloud);
    return "conflict";
  }
  if (!remote) {
    setStatus("saving", target);
    if (!(await insertRemote(target, merged))) return "retry";
  } else if (!syncValuesEqual(remote.state, merged)) {
    setStatus("saving", target);
    if (!(await updateRemote(target, merged, remote.updatedAt))) return "retry";
  }
  if (!isCurrent(target)) return "done";

  // Another tab may have changed account while the write was in flight.
  // Do not reclaim its working copy when the old request completes.
  checkOwnership(target);
  if (target.ownerBlocked) {
    setOwnershipConflict(target, merged);
    return "conflict";
  }
  // Advance the baseline only after local restore and cloud write both succeed.
  saveBaseline(target, merged);
  target.conflict = null;
  if (!syncValuesEqual(getAppState(), merged)) target.dirty = true;
  setStatus(target.dirty ? "saving" : "saved", target);
  return "done";
}

async function runLoop(target: SyncSession) {
  let attempts = 0;
  while (isCurrent(target) && target.dirty) {
    target.dirty = false;
    try {
      const outcome = await syncOnce(target);
      if (!isCurrent(target) || outcome === "conflict") return;
      if (outcome === "retry") {
        attempts += 1;
        if (attempts >= MAX_CAS_ATTEMPTS) throw new Error("Cloud progress changed repeatedly.");
        target.dirty = true;
      } else {
        attempts = 0;
      }
    } catch {
      if (isCurrent(target)) {
        target.dirty = false;
        setStatus("error", target);
      }
      return;
    }
  }
}

function run(target: SyncSession): Promise<void> {
  if (!isCurrent(target)) return Promise.resolve();
  if (target.resolving) {
    target.dirty = true;
    return Promise.resolve();
  }
  if (target.running) return target.running;
  target.running = runLoop(target).finally(() => {
    if (target.running) target.running = null;
    if (isCurrent(target) && target.dirty) void run(target);
  });
  return target.running;
}

function queue(target: SyncSession, delay = 800) {
  if (!isCurrent(target)) return;
  target.dirty = true;
  if (target.timer) clearTimeout(target.timer);
  target.timer = setTimeout(() => {
    target.timer = null;
    void run(target);
  }, delay);
}

export async function startSync(id: string) {
  if (session?.id === id) return retrySync();
  stopSync();
  const target: SyncSession = {
    id,
    generation,
    baseline: loadBaseline(id),
    dirty: true,
    running: null,
    timer: null,
    applyingRemote: false,
    ownerBlocked: false,
    resolving: false,
    conflict: null,
    stopStore: null,
    online: () => queue(target, 0),
    focus: () => queue(target, 0),
  };
  session = target;
  target.stopStore = onAppStateChange(() => {
    if (!target.applyingRemote) queue(target);
  });
  if (typeof window !== "undefined") {
    window.addEventListener("online", target.online);
    window.addEventListener("focus", target.focus);
  }
  setStatus("loading", target);

  // A browser's working copy belongs to the account that last synchronized it.
  // Never upload it silently when a different account signs in.
  await run(target);
}

export async function retrySync() {
  const target = session;
  if (!target) return;
  if (target.timer) {
    clearTimeout(target.timer);
    target.timer = null;
  }
  target.dirty = true;
  if (!target.conflict) setStatus("loading", target);
  await run(target);
}

export async function resolveSyncConflict(choice: "local" | "cloud") {
  const target = session;
  if (!target?.conflict) return;
  const wasAccountChange = target.conflict.choices.reason === "account-change";
  target.resolving = true;
  if (target.timer) {
    clearTimeout(target.timer);
    target.timer = null;
  }
  let continueSync = false;
  try {
    await target.running;
    if (!isCurrent(target) || !target.conflict) return;
    const remote = await readRemote(target);
    if (!isCurrent(target)) return;
    checkOwnership(target);
    const local = validateAppStateForImport(getAppState());
    const cloud = remote?.state ?? createInitialState();
    if (target.ownerBlocked && !wasAccountChange) {
      setOwnershipConflict(target, cloud);
      return;
    }
    const refreshed = target.ownerBlocked
      ? { local, cloud, reason: "account-change" as const }
      : mergeAppStates(target.baseline, local, cloud).conflict;
    if (!refreshed) {
      target.conflict = null;
      target.ownerBlocked = false;
      target.dirty = true;
      continueSync = true;
    } else {
      const selected = validateAppStateForImport(refreshed[choice]);
      if (refreshed.reason === "account-change") claimOwnership(target);
      checkOwnership(target);
      if (target.ownerBlocked) {
        setOwnershipConflict(target, cloud);
        return;
      }
      restoreMerged(target, selected);
      if (!isCurrent(target)) return;
      // The displayed copies already contain every non-conflicting merged change.
      target.baseline = cloud;
      target.conflict = null;
      target.ownerBlocked = false;
      target.dirty = true;
      setStatus("saving", target);
      continueSync = true;
    }
  } catch {
    if (isCurrent(target)) setStatus("error", target);
  } finally {
    target.resolving = false;
  }
  if (continueSync && isCurrent(target)) await run(target);
}

export function stopSync() {
  const target = session;
  generation += 1;
  session = null;
  if (target?.timer) clearTimeout(target.timer);
  target?.stopStore?.();
  if (target && typeof window !== "undefined") {
    window.removeEventListener("online", target.online);
    window.removeEventListener("focus", target.focus);
  }
  setStatus("off");
}
