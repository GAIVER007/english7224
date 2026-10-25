import { beginnerUnits } from "./beginner";
import { intermediateUnits } from "./intermediate";
import { advancedUnits } from "./advanced";
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
export function levelQuestions(level: PathLevel) {
  return unitsForLevel(level).flatMap((unit, index) => {
    const skill = index % 3;
    return unit.questions
      .map((question, i) => ({ ...question, id: `${unit.id}:${i}`, unit }))
      .filter((_, i) => i >= skill * 2 && i < skill * 2 + 2);
  });
}
