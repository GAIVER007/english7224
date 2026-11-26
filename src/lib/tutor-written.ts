import { z } from "zod";
import {
  assignmentMaterial,
  hasTutorNotes,
  tutorSettings,
  writtenExchange,
  writtenMessageLimit,
  type CallAssignment,
  type TeacherAssignment,
  type TutorLesson,
} from "./tutor";

export const writtenRequest = tutorSettings.extend({
  userId: z.string().uuid(),
  spoken: z.literal(true).optional(),
  assignment: assignmentMaterial.optional(),
  step: z.number().int().nonnegative(),
  history: z.array(writtenExchange).max(4),
  question: z.string().trim().min(1).max(writtenMessageLimit),
});

// Keep unnumbered material together, including reading passages and word banks.
export function worksheet(text: string) {
  const sections = text.trim().split(/\n(?=[ \t]*(?:\d{1,3}[.)]|\(\d{1,3}\))[ \t]+)/u);
  const intro =
    sections.length > 1 && !/^\s*(?:\d{1,3}[.)]|\(\d{1,3}\))\s/.test(sections[0]!)
      ? sections.shift()!
      : "";
  return { intro, exercises: sections };
}

function writtenActivity(assignment: TeacherAssignment) {
  // Workbooks saved before timestamps still have their original page and drafts.
  if (assignment.writtenAt !== undefined) return assignment.writtenAt;
  if (assignment.writtenStep !== undefined || Object.keys(assignment.writtenPages ?? {}).length)
    return assignment.createdAt;
  return undefined;
}

export function recentHomework(
  assignments: Record<string, TeacherAssignment> | undefined,
  history: [string, TutorLesson][],
) {
  let recent: { id: string; at: number; written: boolean } | undefined;
  // The lesson list on the tutor page is ordered from newest to oldest.
  const voice = history.find(
    ([, lesson]) =>
      lesson.assignmentId &&
      assignments?.[lesson.assignmentId]?.done === false &&
      hasTutorNotes(lesson),
  )?.[1];
  if (voice?.assignmentId) recent = { id: voice.assignmentId, at: voice.startedAt, written: false };
  for (const [id, assignment] of Object.entries(assignments ?? {})) {
    const at = writtenActivity(assignment);
    if (!assignment.done && at !== undefined && (!recent || at > recent.at))
      recent = { id, at, written: true };
  }
  return recent;
}

export function assignmentForCall(
  assignment: TeacherAssignment,
  lastVoiceAt?: number,
  checkpoint?: string,
): CallAssignment {
  const material = { title: assignment.title, text: assignment.text };
  const at = writtenActivity(assignment);
  if (at === undefined || (lastVoiceAt !== undefined && lastVoiceAt >= at))
    return { ...material, ...(checkpoint && { resumeFrom: checkpoint }) };
  const { exercises } = worksheet(material.text);
  const step = Math.min(assignment.writtenStep ?? 0, exercises.length - 1);
  const page = assignment.writtenPages?.[step];
  return {
    ...material,
    workbook: {
      position: step + 1,
      openingWords: exercises[step]!.trim().slice(0, 240),
      ...(page?.draft.trim() && { draft: page.draft.trim() }),
      ...(page?.exchanges.length && { lastExchange: page.exchanges.at(-1) }),
    },
  };
}
