import { z } from "zod";

export const tutorTopics = ["Знакомство", "Путешествие", "Работа", "Свободный разговор"] as const;
export const tutorLevels = ["A0", "A1", "A2", "B1", "B2", "C1"] as const;
export const tutorSettings = z.object({
  topic: z.enum(tutorTopics),
  level: z.enum(tutorLevels),
});
export const lessonNotes = z.object({
  summary: z.string().trim().min(1).max(1200),
  homework: z.string().trim().max(800),
});
export const tutorLesson = tutorSettings.merge(lessonNotes).extend({
  startedAt: z.number().int().nonnegative(),
  seconds: z.number().int().nonnegative(),
  homeworkDone: z.boolean(),
});
export type TutorLesson = z.infer<typeof tutorLesson>;
export type TutorSettings = z.infer<typeof tutorSettings>;
export const tutorHistory = z.record(z.string().uuid(), tutorLesson);

export const tutorPath = "/api/tutor/live";
export const clientCommand = z.discriminatedUnion("type", [
  tutorSettings.extend({
    type: z.literal("start"),
    token: z.string().min(1).max(12000),
    sdp: z.string().min(1).max(48000),
    previous: z.string().max(2200),
  }),
  z.object({ type: z.literal("mute"), muted: z.boolean() }),
  z.object({ type: z.literal("heartbeat") }),
  z.object({ type: z.literal("finish") }),
]);
export const relayEvent = z.discriminatedUnion("type", [
  z.object({ type: z.literal("answer"), sdp: z.string() }),
  z.object({ type: z.literal("caption"), who: z.enum(["Юрий", "Mira"]), delta: z.string() }),
  z.object({ type: z.literal("usage"), seconds: z.number().nonnegative() }),
  lessonNotes.extend({ type: z.literal("notes") }),
  z.object({ type: z.literal("error"), message: z.string() }),
]);
export type RelayEvent = z.infer<typeof relayEvent>;
