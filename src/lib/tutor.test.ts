import { describe, expect, it, vi } from "vitest";
import { createBackup, parseBackup } from "./backup";
import { createInitialState, validateAppStateForImport } from "./store";
import { mergeAppStates } from "./sync-merge";
import { assignmentForCall, recentHomework } from "./tutor-written";
import { TutorCall } from "./tutor-call";
import {
  assignmentTextLimit,
  missingTutorNotes,
  tutorContinuation,
  validateTutorSearch,
  type TutorLesson,
} from "./tutor";

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
  it("migrates old homework libraries and syncs new assignments and completion across backups", () => {
    const old = createInitialState();
    delete old.teacherAssignments;
    const base = validateAppStateForImport(old);
    expect(base.teacherAssignments).toEqual({});
    const assignment = {
      title: "Questions",
      text: "Where is the station?",
      done: false,
      createdAt: 10,
    };
    base.teacherAssignments = { [first]: assignment };
    const local = { ...base, teacherAssignments: { [first]: { ...assignment, done: true } } };
    const cloud = {
      ...base,
      teacherAssignments: {
        ...base.teacherAssignments,
        [second]: { ...assignment, title: "Lesson 2" },
      },
    };
    const merged = mergeAppStates(base, local, cloud);
    expect(merged.conflict).toBeNull();
    expect(parseBackup(createBackup(merged.state!)).state.teacherAssignments).toEqual({
      ...cloud.teacherAssignments,
      ...local.teacherAssignments,
    });
    expect(() =>
      validateAppStateForImport({
        ...base,
        teacherAssignments: {
          [first]: { ...assignment, text: "x".repeat(assignmentTextLimit + 1) },
        },
      }),
    ).toThrow("teacherAssignments");
  });
  it("restores earlier workbooks and follows the most recent unfinished lesson across modes", () => {
    const sheet = {
      title: "Travel",
      text: "1. Train\n2. Bus",
      done: false,
      createdAt: 10,
      writtenStep: 1,
      writtenPages: { 1: { draft: "By bus", exchanges: [] } },
    };
    const call = { ...lesson, assignmentId: first, startedAt: 20, resumeFrom: "Ask for a ticket." };
    expect(assignmentForCall(sheet).workbook).toMatchObject({ position: 2, draft: "By bus" });
    expect(assignmentForCall(sheet, 20, call.resumeFrom)).toEqual({
      title: sheet.title,
      text: sheet.text,
      resumeFrom: call.resumeFrom,
    });
    const homework = { [first]: sheet, [second]: { ...sheet, writtenAt: 30 } };
    expect(recentHomework(homework, [[first, call]])?.id).toBe(second);
    expect(
      recentHomework({ ...homework, [second]: { ...homework[second], done: true } }, [
        [first, call],
      ]),
    ).toMatchObject({ id: first, written: false });
    expect(validateTutorSearch({ tutor: { ...call, mode: "written", draft: "private" } })).toEqual({
      tutor: { assignmentId: first, topic: lesson.topic, level: lesson.level, mode: "written" },
    });
  });
  it("carries the assignment ID through sign-in without its content", () => {
    const tutor = { topic: "Работа", level: "A2", assignmentId: first };
    expect(validateTutorSearch({ tutor: { ...tutor, text: "private exercise" } })).toEqual({
      tutor,
    });
  });
  it("recovers the saved exercise after interrupted calls, backups and unrelated lessons", () => {
    const saved = {
      ...lesson,
      assignmentId: first,
      resumeFrom: "Упражнение 3, вопрос про вокзал.",
    };
    const lessons = {
      [first]: saved,
      [second]: { ...lesson, assignmentId: second, startedAt: 90, resumeFrom: "Другая тема." },
      [crypto.randomUUID()]: {
        ...lesson,
        assignmentId: first,
        startedAt: 100,
        partial: true as const,
        summary: "Hello!",
        homework: "",
      },
      [crypto.randomUUID()]: {
        ...lesson,
        assignmentId: first,
        startedAt: 110,
        summary: missingTutorNotes,
        homework: "",
      },
      [crypto.randomUUID()]: {
        ...lesson,
        assignmentId: first,
        startedAt: 120,
        summary: "Mira: Hi!",
        homework: "",
      },
    };
    const backup = parseBackup(createBackup({ ...createInitialState(), tutorLessons: lessons }));
    expect(tutorContinuation(backup.state.tutorLessons, first)).toEqual({
      last: saved,
      checkpoint: saved.resumeFrom,
    });
    expect(tutorContinuation(lessons).checkpoint).toBeUndefined();
    const finished = { ...saved, startedAt: 130, resumeFrom: "" };
    expect(tutorContinuation({ ...lessons, [crypto.randomUUID()]: finished }, first)).toEqual({
      last: finished,
      checkpoint: undefined,
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
      vi.useFakeTimers();
      const getToken = vi.fn(async () => "fixture");
      const connecting = call.start(getToken, "");
      await vi.advanceTimersByTimeAsync(60000);
      expect(callbacks.ended).not.toHaveBeenCalled();
      call.finish();
      allow({ getTracks: () => [{ stop }] } as unknown as MediaStream);
      await connecting;
      expect(stop).toHaveBeenCalledOnce();
      expect(getToken).not.toHaveBeenCalled();
      expect(callbacks.save).not.toHaveBeenCalled();
      expect(callbacks.ended).toHaveBeenCalledOnce();
    } finally {
      if (original) Object.defineProperty(navigator, "mediaDevices", original);
      else Reflect.deleteProperty(navigator, "mediaDevices");
      vi.useRealTimers();
      vi.unstubAllGlobals();
    }
  });

  it.each(["timeout", "closed", "connected"] as const)(
    "distinguishes an accepted answer from a working audio connection (%s)",
    async (outcome) => {
      const stop = vi.fn();
      const channel = { readyState: "connecting", close: vi.fn(), onopen: () => {} };
      const peer = {
        addTrack: vi.fn(),
        createDataChannel: () => channel,
        createOffer: async () => ({ type: "offer", sdp: "offer" }),
        setLocalDescription: vi.fn(),
        setRemoteDescription: vi.fn(),
        iceGatheringState: "complete",
        connectionState: "connecting",
        onconnectionstatechange: () => {},
        close: vi.fn(),
      };
      const socket = {
        onmessage: (_event: MessageEvent) => {},
        onclose: (_event: CloseEvent) => {},
        close: vi.fn(),
      };
      vi.useFakeTimers();
      vi.stubGlobal("navigator", {
        mediaDevices: { getUserMedia: async () => ({ getTracks: () => [{ stop }] }) },
      });
      vi.stubGlobal(
        "RTCPeerConnection",
        class {
          constructor() {
            return peer;
          }
        },
      );
      vi.stubGlobal(
        "WebSocket",
        class {
          static OPEN = 1;
          constructor() {
            return socket;
          }
        },
      );
      const callbacks = {
        phase: vi.fn(),
        caption: vi.fn(),
        playbackBlocked: vi.fn(),
        ended: vi.fn(),
        save: vi.fn(),
      };
      const call = new TutorCall(lesson, document.createElement("audio"), callbacks);
      try {
        await call.start(async () => "token", "");
        socket.onmessage(
          new MessageEvent("message", { data: JSON.stringify({ type: "answer", sdp: "answer" }) }),
        );
        await vi.advanceTimersByTimeAsync(0);
        expect(callbacks.phase.mock.calls).toEqual([["connectingAudio"]]);
        if (outcome === "connected") {
          peer.connectionState = "connected";
          peer.onconnectionstatechange();
          expect(callbacks.phase).not.toHaveBeenCalledWith("active");
          channel.readyState = "open";
          channel.onopen();
        } else if (outcome === "closed") {
          socket.onclose(new CloseEvent("close", { code: 1000 }));
        }
        await vi.advanceTimersByTimeAsync(45000);
        if (outcome === "connected") {
          expect(callbacks.phase).toHaveBeenLastCalledWith("active");
          expect(callbacks.ended).not.toHaveBeenCalled();
        } else {
          expect(callbacks.ended.mock.calls).toEqual([
            [expect.stringContaining("подключить звук")],
          ]);
          expect(stop).toHaveBeenCalledOnce();
          expect(callbacks.save).not.toHaveBeenCalled();
        }
      } finally {
        call.close("");
        vi.useRealTimers();
        vi.unstubAllGlobals();
      }
    },
  );
});
