import { z } from "zod";
import { PATH_LEVELS } from "./types";
const count = z.number().int().nonnegative();
const vocabularyCardSchema = z.object({
  box: count.max(5),
  due: z.number().finite().nonnegative(),
  correct: count,
  wrong: count,
});
export const pathUnitProgressSchema = z
  .object({
    stage: count.max(5),
    writing: z.string().max(4000),
    writingChecks: z.array(z.boolean()).length(3),
    speakingChecks: z.array(z.boolean()).length(3),
    answers: z.record(z.string()),
    submitted: z.boolean(),
    passed: z.boolean(),
    best: count.max(6),
    attempts: count,
    due: count,
  })
  .refine((u) => !u.passed || u.best >= 5, {
    message: "Passed unit requires a passing best score",
  });
export type PathUnitProgress = z.infer<typeof pathUnitProgressSchema>;
export const pathStateSchema = z.object({
  selected: z.enum(PATH_LEVELS),
  vocabulary: z
    .record(z.string().regex(/^(a0|a1|a2|b1|b2|c1)-(0[1-9]|1[0-2]):v:.+$/), vocabularyCardSchema)
    .default({}),
  units: z.record(
    z.string().regex(/^(a0|a1|a2|b1|b2|c1)-(0[1-9]|1[0-2])$/),
    pathUnitProgressSchema,
  ),
  exams: z.record(
    z.enum(PATH_LEVELS),
    z
      .object({
        version: z.union([z.literal(1), z.literal(2)]).optional(),
        answers: z.record(z.string()),
        submitted: z.boolean(),
        passed: z.boolean(),
        best: count.max(24),
        attempts: count,
      })
      .refine((e) => !e.passed || e.best >= 20, {
        message: "Passed assessment requires a passing score",
      }),
  ),
  history: z.array(
    z
      .object({
        id: z
          .string()
          .regex(/^(?:(?:a0|a1|a2|b1|b2|c1)-(?:0[1-9]|1[0-2])|exam:(?:A0|A1|A2|B1|B2|C1))$/),
        at: count,
        correct: count,
        total: count.refine((n): boolean => n === 6 || n === 24),
        passed: z.boolean(),
        examVersion: z.union([z.literal(1), z.literal(2)]).optional(),
        reviewUnitIds: z
          .array(z.string().regex(/^(a0|a1|a2|b1|b2|c1)-(0[1-9]|1[0-2])$/))
          .max(12)
          .optional(),
      })
      .refine(
        (r) =>
          r.correct <= r.total &&
          r.passed === r.correct / r.total >= 0.8 &&
          r.total === (r.id.startsWith("exam:") ? 24 : 6),
      ),
  ),
});
export type PathState = z.infer<typeof pathStateSchema>;
export function emptyPath(): PathState {
  return { selected: "A0", vocabulary: {}, units: {}, exams: {}, history: [] };
}
export function emptyUnit(): PathUnitProgress {
  return {
    stage: 0,
    writing: "",
    writingChecks: [false, false, false],
    speakingChecks: [false, false, false],
    answers: {},
    submitted: false,
    passed: false,
    best: 0,
    attempts: 0,
    due: 0,
  };
}

export function examBankVersion(exam?: PathState["exams"]["A0"]): 1 | 2 {
  return exam?.version ?? (exam?.submitted || Object.keys(exam?.answers ?? {}).length > 0 ? 1 : 2);
}
