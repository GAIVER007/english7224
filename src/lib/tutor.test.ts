import { describe, expect, it, vi } from "vitest";
import { createBackup, parseBackup } from "./backup";
import { createInitialState, validateAppStateForImport } from "./store";
import { mergeAppStates } from "./sync-merge";
import { TutorCall } from "./tutor-call";
import type { TutorLesson } from "./tutor";

const first = "04baca84-36e7-438f-9af2-1278734d8bca";
const second = "d471df79-9f87-42be-adb4-9417fe2e07ed";
const lesson: TutorLesson = {
  topic: "Путешествие",
  level: "A2",
  seconds: 32,
  startedAt: 40,
  summary: "Практика в отеле",
  homework: "Задать три вопроса",
  homeworkDone: false,
};

describe("tutor progress", () => {
  it("restores legacy profiles and preserves concurrent homework and lessons through a backup", () => {
    const old = createInitialState();
    delete old.tutorLessons;
    const migrated = validateAppStateForImport(old);
    expect(migrated.tutorLessons).toEqual({});
    const base = { ...migrated, tutorLessons: { [first]: lesson } };
    const local = { ...base, tutorLessons: { [first]: { ...lesson, homeworkDone: true } } };
    const cloud = {
      ...base,
      tutorLessons: { ...base.tutorLessons, [second]: { ...lesson, startedAt: 80 } },
    };
    const merged = mergeAppStates(base, local, cloud);
    expect(merged.conflict).toBeNull();
    expect(parseBackup(createBackup(merged.state!)).state.tutorLessons).toEqual({
      ...cloud.tutorLessons,
      ...local.tutorLessons,
    });
  });
  it("rejects malformed homework in imported backups", () => {
    expect(() =>
      validateAppStateForImport({
        ...createInitialState(),
        tutorLessons: { [first]: { ...lesson, homeworkDone: "yes" } },
      }),
    ).toThrow("tutorLessons");
  });
  it("releases a microphone granted after the user cancels a pending call", async () => {
    const stop = vi.fn();
    let allow!: (s: MediaStream) => void;
    const media = new Promise<MediaStream>((r) => {
      allow = r;
    });
    const original = Object.getOwnPropertyDescriptor(navigator, "mediaDevices");
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: () => media },
    });
    vi.stubGlobal("RTCPeerConnection", vi.fn());
    const callbacks = {
      phase: vi.fn(),
      caption: vi.fn(),
      playbackBlocked: vi.fn(),
      ended: vi.fn(),
      save: vi.fn(),
    };
    try {
      const call = new TutorCall(lesson, document.createElement("audio"), callbacks);
      const connecting = call.start("fixture", "");
      call.finish();
      allow({ getTracks: () => [{ stop }] } as unknown as MediaStream);
      await connecting;
      expect(stop).toHaveBeenCalledOnce();
      expect(callbacks.save).not.toHaveBeenCalled();
      expect(callbacks.ended).toHaveBeenCalledOnce();
    } finally {
      if (original) Object.defineProperty(navigator, "mediaDevices", original);
      else Reflect.deleteProperty(navigator, "mediaDevices");
      vi.unstubAllGlobals();
    }
  });
});
