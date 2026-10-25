import type { AppState } from "../store";
import { canTakeLevel } from "./progress";
import { PATH_LEVELS, unitsForLevel } from "./index";
import { emptyPath } from "./state";
import type { PathLevel, PathUnit } from "./types";
import { duePathVocabulary } from "./vocabulary";

export type PathwayPlanActionKind =
  | "word-review"
  | "remediation"
  | "resume-unit"
  | "unit-review"
  | "level-exam"
  | "next-unit"
  | "next-level"
  | "complete";

export interface PathwayPlanAction {
  id: string;
  kind: PathwayPlanActionKind;
  title: string;
  reason: string;
  label: string;
  search: { unit?: string; exam?: PathLevel; review?: string };
  unitId?: string;
  selectLevel?: PathLevel;
}

function latestExamAttempt(state: AppState, level: PathLevel) {
  const path = state.pathway ?? emptyPath();
  return path.history
    .filter((result) => result.id === `exam:${level}`)
    .reduce<(typeof path.history)[number] | undefined>(
      (latest, result) => (!latest || result.at > latest.at ? result : latest),
      undefined,
    );
}

/** Topics from the latest selected-level exam that have not since been passed again. */
export function revisionUnits(state: AppState): PathUnit[] {
  const path = state.pathway ?? emptyPath();
  const exam = latestExamAttempt(state, path.selected);
  if (!exam?.reviewUnitIds?.length) return [];
  const passedAfterExam = new Set(
    path.history
      .filter((result) => result.passed && result.at > exam.at)
      .map((result) => result.id),
  );
  const requested = new Set(exam.reviewUnitIds.filter((id) => !passedAfterExam.has(id)));
  return unitsForLevel(path.selected).filter((unit) => requested.has(unit.id));
}

function hasStarted(progress: NonNullable<AppState["pathway"]>["units"][string]) {
  return (
    progress.stage > 0 ||
    progress.writing.trim().length > 0 ||
    progress.writingChecks.some(Boolean) ||
    progress.speakingChecks.some(Boolean) ||
    Object.keys(progress.answers).length > 0
  );
}

function wordLabel(count: number) {
  const lastTwo = count % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return "слов";
  return count % 10 === 1 ? "слова" : "слов";
}

/** A stable, read-only recommendation list. The first item is today's main action. */
export function pathwayPlan(state: AppState, now = Date.now()): PathwayPlanAction[] {
  const path = state.pathway ?? emptyPath();
  const selectedUnits = unitsForLevel(path.selected);
  const actions: PathwayPlanAction[] = [];
  const dueWords = duePathVocabulary(state, now).length;

  if (dueWords > 0) {
    actions.push({
      id: "word-review",
      kind: "word-review",
      title: "Вспомнить слова",
      reason: `Сегодня подошёл срок для ${dueWords} ${wordLabel(dueWords)}. Короткая сессия вернёт их в память.`,
      label: `Повторить ${Math.min(5, dueWords)}`,
      search: { review: "due" },
    });
  }

  const remediation = revisionUnits(state);
  if (remediation.length > 0) {
    const unit = remediation[0]!;
    actions.push({
      id: `remediation:${unit.id}`,
      kind: "remediation",
      title: `Закрепить: ${unit.title}`,
      reason:
        remediation.length === 1
          ? `В последней контрольной ${path.selected} здесь были ошибки. После повторного зачёта подсказка исчезнет.`
          : `Это первая из ${remediation.length} тем с ошибками в последней контрольной ${path.selected}.`,
      label: "Разобрать тему",
      search: { unit: unit.id },
      unitId: unit.id,
    });
  }

  const unfinished = selectedUnits.find((unit) => {
    const progress = path.units[unit.id];
    return progress && !progress.submitted && hasStarted(progress);
  });
  if (unfinished && !remediation.some((unit) => unit.id === unfinished.id)) {
    const progress = path.units[unfinished.id]!;
    actions.push({
      id: `resume:${unfinished.id}`,
      kind: "resume-unit",
      title: unfinished.title,
      reason: `Тема уже начата: этап ${progress.stage + 1} из 6. Продолжи с сохранённого места.`,
      label: "Продолжить тему",
      search: { unit: unfinished.id },
      unitId: unfinished.id,
    });
  }

  const dueUnit = unitsForLevel(path.selected)
    .filter(
      (unit) =>
        path.units[unit.id]?.passed &&
        path.units[unit.id]!.due <= now &&
        !remediation.some((item) => item.id === unit.id),
    )
    .sort((left, right) => path.units[left.id]!.due - path.units[right.id]!.due)[0];
  if (dueUnit) {
    actions.push({
      id: `unit-review:${dueUnit.id}`,
      kind: "unit-review",
      title: `Освежить: ${dueUnit.title}`,
      reason: "Прошла неделя после зачёта. Быстро повтори материал, чтобы он не стёрся.",
      label: "Повторить тему",
      search: { unit: dueUnit.id },
      unitId: dueUnit.id,
    });
  }

  const allUnitsPassed = canTakeLevel(state, path.selected);
  const examPassed = Boolean(path.exams[path.selected]?.passed);
  if (allUnitsPassed && !examPassed) {
    actions.push({
      id: `exam:${path.selected}`,
      kind: "level-exam",
      title: `Контрольная ${path.selected}`,
      reason:
        "Все темы этапа пройдены. Проверь грамматику, чтение и аудирование на новых заданиях.",
      label: "Начать контрольную",
      search: { exam: path.selected },
    });
  }

  const nextUnit = selectedUnits.find((unit) => !path.units[unit.id]?.passed);
  if (nextUnit && nextUnit.id !== unfinished?.id) {
    const index = selectedUnits.indexOf(nextUnit) + 1;
    actions.push({
      id: `next:${nextUnit.id}`,
      kind: "next-unit",
      title: nextUnit.title,
      reason: `Следующая тема ${path.selected}: ${index} из ${selectedUnits.length}. Шесть коротких этапов с практикой.`,
      label: "Начать тему",
      search: { unit: nextUnit.id },
      unitId: nextUnit.id,
    });
  }

  if (allUnitsPassed && examPassed) {
    const nextLevel = PATH_LEVELS[PATH_LEVELS.indexOf(path.selected) + 1];
    if (nextLevel) {
      actions.push({
        id: `level:${nextLevel}`,
        kind: "next-level",
        title: `Открыть программу ${nextLevel}`,
        reason: `${path.selected} пройден. Переход меняет выбранную сложность, а весь прежний прогресс остаётся на месте.`,
        label: `Перейти к ${nextLevel}`,
        search: {},
        selectLevel: nextLevel,
      });
    }
  }

  if (actions.length === 0) {
    actions.push({
      id: "complete",
      kind: "complete",
      title: `Этап ${path.selected} пройден`,
      reason: `Темы и контрольная ${path.selected} пройдены. Можно открыть программу и повторить любой этап.`,
      label: "Открыть программу",
      search: {},
    });
  }

  return actions.slice(0, 4);
}
