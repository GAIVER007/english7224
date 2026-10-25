import { beginnerExamQuestionsB } from "./exam-beginner-b";
import { intermediateExamQuestionsB } from "./exam-intermediate-b";
import { advancedExamQuestionsB } from "./exam-advanced-b";
import { beginnerUnits } from "./beginner";
import { intermediateUnits } from "./intermediate";
import { advancedUnits } from "./advanced";
import { beginnerExamQuestions } from "./exam-beginner";
import { intermediateExamQuestions } from "./exam-intermediate";
import { advancedExamQuestions } from "./exam-advanced";
import type { ExamQuestion } from "./exam-types";
import type { PathLevel } from "./types";
export { PATH_LEVELS } from "./types";
export const pathUnits = [...beginnerUnits, ...intermediateUnits, ...advancedUnits];
export const levelTitles: Record<PathLevel, string> = {
  A0: "С самого начала",
  A1: "Первые разговоры",
  A2: "Повседневная жизнь",
  B1: "Самостоятельное общение",
  B2: "Аргументы и уверенность",
  C1: "Точность и сложные смыслы",
};
export const unitsForLevel = (level: PathLevel) => pathUnits.filter((u) => u.level === level);
export function levelQuestions(level: PathLevel, version: 1 | 2 | 3 = 2): ExamQuestion[] {
  if (version === 3)
    return { ...beginnerExamQuestionsB, ...intermediateExamQuestionsB, ...advancedExamQuestionsB }[
      level
    ];
  if (version === 2)
    return { ...beginnerExamQuestions, ...intermediateExamQuestions, ...advancedExamQuestions }[
      level
    ];
  return unitsForLevel(level).flatMap((unit, index) => {
    const skill = index % 3;
    return unit.questions
      .map((question, i) => ({
        ...question,
        id: `${unit.id}:${i}`,
        unitId: unit.id,
        ...(question.skill === "reading"
          ? { passage: unit.reading }
          : question.skill === "listening"
            ? { passage: unit.listening }
            : {}),
      }))
      .filter((_, i) => i >= skill * 2 && i < skill * 2 + 2);
  });
}
