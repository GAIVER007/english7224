import type { RecallWord } from "@/components/RecallPractice";
import { recordPractice } from "../motivation";
import { review, touchStreak, type AppState, type CardState } from "../store";
import { pathUnits } from "./index";
import { emptyPath } from "./state";
import type { PathUnit } from "./types";

const DAY = 86_400_000;

function normalizedPrompt(value: string) {
  return value.trim().toLocaleLowerCase("ru-RU");
}

export function pathVocabularyId(unitId: string, english: string) {
  return `${unitId}:v:${encodeURIComponent(english.trim().toLocaleLowerCase("en-US"))}`;
}

const promptCounts = new Map<string, number>();
const targetsByPromptAndLength = new Map<string, Set<string>>();
for (const unit of pathUnits) {
  for (const word of unit.vocabulary) {
    const prompt = normalizedPrompt(word.ru);
    promptCounts.set(prompt, (promptCounts.get(prompt) ?? 0) + 1);
    const wordCount = word.en.trim().split(/\s+/).length;
    const key = `${prompt}:${wordCount}`;
    const targets = targetsByPromptAndLength.get(key) ?? new Set<string>();
    targets.add(word.en);
    targetsByPromptAndLength.set(key, targets);
  }
}

function uniqueInitial(target: string, alternatives: Set<string> | undefined) {
  if (!alternatives || alternatives.size < 2) return null;
  const normalizedTarget = target.toLocaleLowerCase("en-US");
  const others = [...alternatives]
    .map((value) => value.toLocaleLowerCase("en-US"))
    .filter((value) => value !== normalizedTarget);
  for (let length = 1; length <= normalizedTarget.length; length += 1) {
    const prefix = normalizedTarget.slice(0, length);
    if (others.every((value) => !value.startsWith(prefix))) {
      return length < normalizedTarget.length ? `${prefix}…` : prefix;
    }
  }
  return normalizedTarget;
}

export function pathVocabularyWords(unit: PathUnit): RecallWord[] {
  return unit.vocabulary.map((word) => {
    const count = word.en.trim().split(/\s+/).length;
    const prompt = normalizedPrompt(word.ru);
    const initial = uniqueInitial(word.en, targetsByPromptAndLength.get(`${prompt}:${count}`));
    const recallHint =
      (promptCounts.get(prompt) ?? 0) > 1
        ? [
            `Точное выражение из темы «${unit.title}»`,
            `${count} ${count === 1 ? "слово" : "слова"}`,
            initial ? `начинается с «${initial}»` : null,
          ]
            .filter(Boolean)
            .join(" · ")
        : null;
    return {
      id: pathVocabularyId(unit.id, word.en),
      en: word.en,
      ru: word.ru,
      ...(recallHint ? { recallHint } : {}),
    };
  });
}

const allPathWords = pathUnits.flatMap(pathVocabularyWords);
const pathWordMap = new Map(allPathWords.map((word) => [word.id, word]));

export function learnPathVocabulary(state: AppState, unit: PathUnit, now = Date.now()): AppState {
  const path = state.pathway ?? emptyPath();
  const vocabulary = { ...path.vocabulary };
  for (const word of pathVocabularyWords(unit)) {
    vocabulary[word.id] ??= { box: 0, due: now, correct: 0, wrong: 0 };
  }
  return { ...state, pathway: { ...path, vocabulary } };
}

export function duePathVocabulary(
  state: AppState,
  now = Date.now(),
  unit?: PathUnit,
): RecallWord[] {
  const path = state.pathway ?? emptyPath();
  const candidates = unit ? pathVocabularyWords(unit) : allPathWords;
  return candidates
    .filter((word) => (path.vocabulary[word.id]?.due ?? Number.POSITIVE_INFINITY) <= now)
    .sort((a, b) => {
      const left = path.vocabulary[a.id]!;
      const right = path.vocabulary[b.id]!;
      return left.due - right.due || left.box - right.box;
    });
}

export function learnedPathVocabularyCount(state: AppState, unit?: PathUnit) {
  const cards = state.pathway?.vocabulary ?? {};
  return (unit ? pathVocabularyWords(unit) : allPathWords).filter(
    (word) => cards[word.id] !== undefined,
  ).length;
}

export function reviewPathVocabulary(
  state: AppState,
  id: string,
  correct: boolean,
  now = Date.now(),
): AppState {
  const path = state.pathway ?? emptyPath();
  const current = path.vocabulary[id];
  if (!current || !pathWordMap.has(id)) return state;
  if (correct && current.due > now) return state;

  const vocabulary: Record<string, CardState> = {
    ...path.vocabulary,
    [id]: review(current, correct, now),
  };
  const next = {
    ...state,
    xp: state.xp + (correct && current.correct === 0 ? 1 : 0),
    pathway: { ...path, vocabulary },
  };
  return recordPractice(touchStreak(next, now), now, "language");
}

export function nextPathVocabularyDue(state: AppState) {
  const cards = Object.values(state.pathway?.vocabulary ?? {});
  return cards.length ? Math.min(...cards.map((card) => card.due)) : null;
}

export function formatPathVocabularyDue(due: number, now = Date.now()) {
  if (due <= now) return "сейчас";
  const days = Math.max(1, Math.ceil((due - now) / DAY));
  return days === 1 ? "завтра" : `через ${days} дн.`;
}
