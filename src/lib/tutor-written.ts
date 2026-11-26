import { z } from "zod";
import { assignmentMaterial, tutorSettings, writtenExchange, writtenMessageLimit } from "./tutor";

export const writtenRequest = tutorSettings.extend({
  userId: z.string().uuid(),
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
