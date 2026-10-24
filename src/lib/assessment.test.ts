import { expect, it } from "vitest";
import { lessons } from "./content";
import {
  createMissionAssessment,
  createModuleAssessment,
  assessmentAnswerCorrect,
} from "./assessment";
import { courseModules } from "./curriculum";

it("checks memory, comprehension and authored grammar in every mission", () => {
  for (const lesson of lessons) {
    const questions = createMissionAssessment(lesson);
    expect(questions).toHaveLength(7);
    expect(questions.filter((q) => !q.options)).toHaveLength(4);
    expect(questions.filter((q) => q.audio)).toHaveLength(1);
    expect(questions.find((q) => q.area === "Грамматика")?.answer).toBe(lesson.grammarQuiz.answer);
    expect(new Set(questions.map((q) => q.id)).size).toBe(7);
    for (const q of questions) {
      if (q.options) {
        expect(q.options).toContain(q.answer);
        expect(new Set(q.options).size).toBe(q.options.length);
        expect(q.options.length).toBeGreaterThan(1);
      }
      expect(assessmentAnswerCorrect(q, q.answer)).toBe(true);
      expect(assessmentAnswerCorrect(q, "")).toBe(false);
    }
  }
});

it("samples all five missions in each module instead of only recent vocabulary", () => {
  for (const module of courseModules) {
    const group = lessons.filter((l) => l.day >= module.startDay && l.day <= module.endDay);
    const questions = createModuleAssessment(group);
    expect(questions).toHaveLength(15);
    for (const lesson of group) {
      expect(questions.some((q) => q.id === `grammar:${lesson.day}`)).toBe(true);
      expect(questions.filter((q) => lesson.words.some((w) => w.id === q.wordId))).toHaveLength(2);
    }
  }
});
