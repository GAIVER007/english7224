import { z } from "zod";

export const tutorTopics = ["Знакомство", "Путешествие", "Работа", "Свободный разговор"] as const;
export const tutorLevels = ["A0", "A1", "A2", "B1", "B2", "C1"] as const;
export const tutorSettings = z.object({
  topic: z.enum(tutorTopics),
  level: z.enum(tutorLevels),
});
export const assignmentTextLimit = 8000;
export const assignmentTitleLimit = 120;
export const assignmentMaterial = z.object({
  title: z.string().trim().min(1).max(assignmentTitleLimit),
  text: z.string().trim().min(1).max(assignmentTextLimit),
});
const resumeFrom = z.string().trim().max(320);
const callAssignment = assignmentMaterial.extend({ resumeFrom: resumeFrom.optional() });
export type CallAssignment = z.infer<typeof callAssignment>;
export const teacherAssignment = assignmentMaterial.extend({
  createdAt: z.number().int().nonnegative(),
  done: z.boolean(),
});
export const assignmentLibrary = z.record(z.string().uuid(), teacherAssignment);
export type TeacherAssignment = z.infer<typeof teacherAssignment>;
export type AssignmentMaterial = z.infer<typeof assignmentMaterial>;
const tutorSelection = tutorSettings.extend({ assignmentId: z.string().uuid().optional() });
export type TutorSelection = z.infer<typeof tutorSelection>;

export const lessonNotes = z.object({
  summary: z.string().trim().min(1).max(1200),
  homework: z.string().trim().max(800),
  resumeFrom: resumeFrom.optional(),
});
export const tutorLesson = tutorSelection.merge(lessonNotes).extend({
  assignmentTitle: assignmentMaterial.shape.title.optional(),
  partial: z.literal(true).optional(),
  startedAt: z.number().int().nonnegative(),
  seconds: z.number().int().nonnegative(),
  homeworkDone: z.boolean(),
});
export type TutorLesson = z.infer<typeof tutorLesson>;
export type TutorSettings = z.infer<typeof tutorSettings>;
/** Only carry a known lesson selection across the account and tutor routes. */
export function validateTutorSearch(search: Record<string, unknown>): { tutor?: TutorSelection } {
  const selection = tutorSelection.safeParse(search["tutor"]);
  return selection.success ? { tutor: selection.data } : {};
}

export const tutorHistory = z.record(z.string().uuid(), tutorLesson);

export const missingTutorNotes = "Звонок завершён без конспекта.";

export function tutorContinuation(
  lessons: Record<string, TutorLesson> | undefined,
  assignmentId?: string,
) {
  const history = Object.values(lessons ?? {})
    .filter((lesson) => lesson.assignmentId === assignmentId && !lesson.partial)
    .sort((a, b) => b.startedAt - a.startedAt);
  // Older clients used the last caption as a summary when notes never arrived.
  const last = history.find(
    (lesson) =>
      lesson.homework ||
      lesson.resumeFrom ||
      (lesson.summary !== missingTutorNotes && !/^(Mira|Юрий): /.test(lesson.summary)),
  );
  const checkpoint = assignmentId
    ? history.find((lesson) => lesson.resumeFrom !== undefined)?.resumeFrom || undefined
    : undefined;
  return { last, checkpoint };
}

export const tutorPath = "/api/tutor/live";
export const clientCommand = z.discriminatedUnion("type", [
  tutorSettings.extend({
    type: z.literal("start"),
    token: z.string().min(1).max(12000),
    sdp: z.string().min(1).max(48000),
    assignment: callAssignment.optional(),
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
