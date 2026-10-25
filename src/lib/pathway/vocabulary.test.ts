import { describe, expect, it } from "vitest";
import { createBackup, parseBackup } from "../backup";
import { createInitialState } from "../store";
import { isRecallAnswerCorrect } from "../recall";
import { pathUnits } from "./index";
import {
  duePathVocabulary,
  learnPathVocabulary,
  pathVocabularyId,
  pathVocabularyWords,
  reviewPathVocabulary,
} from "./vocabulary";

describe("pathway vocabulary repetition", () => {
  const unit = pathUnits[0]!;

  it("uses stable unique IDs and disambiguates identical Russian prompts", () => {
    const words = pathUnits.flatMap(pathVocabularyWords);
    expect(new Set(words.map((word) => word.id)).size).toBe(words.length);
    expect(pathVocabularyId(unit.id, "First Name")).toBe("a0-01:v:first%20name");

    const name = pathVocabularyWords(unit).find((word) => word.en === "name")!;
    const firstName = pathVocabularyWords(unit).find((word) => word.en === "first name")!;
    expect(name.recallHint).toMatch(/1 слово/);
    expect(firstName.recallHint).toMatch(/2 слова/);

    const inspect = words.find((word) => word.en === "inspect")!;
    const verify = words.find((word) => word.en === "verify")!;
    expect(inspect.recallHint).toMatch(/начинается с «i…»/);
    expect(verify.recallHint).toMatch(/начинается с «v…»/);
    expect(isRecallAnswerCorrect("verify", inspect.en)).toBe(false);
    expect(isRecallAnswerCorrect("inspect", verify.en)).toBe(false);
  });

  it("opts a unit into review without changing legacy cards and keeps the sixth word due", () => {
    const initial = createInitialState();
    initial.cards["legacy"] = { box: 3, due: 99, correct: 4, wrong: 1 };
    const learned = learnPathVocabulary(initial, unit, 1_000);

    expect(Object.keys(learned.pathway!.vocabulary)).toHaveLength(unit.vocabulary.length);
    expect(duePathVocabulary(learned, 1_000, unit)).toHaveLength(unit.vocabulary.length);
    expect(duePathVocabulary(learned, 1_000, unit).slice(0, 5)).toHaveLength(5);
    expect(learned.cards).toEqual(initial.cards);
  });

  it("advances only due recalls, resets mistakes, and awards recall XP once per word", () => {
    const now = 1_000;
    const learned = learnPathVocabulary(createInitialState(), unit, now);
    const word = pathVocabularyWords(unit)[0]!;
    const first = reviewPathVocabulary(learned, word.id, true, now);
    expect(first.pathway!.vocabulary[word.id]).toMatchObject({
      box: 1,
      due: now + 86_400_000,
      correct: 1,
      wrong: 0,
    });
    expect(first.xp).toBe(1);

    expect(reviewPathVocabulary(first, word.id, true, now + 10)).toBe(first);

    const missedEarly = reviewPathVocabulary(first, word.id, false, now + 20);
    expect(missedEarly.pathway!.vocabulary[word.id]).toMatchObject({
      box: 0,
      due: now + 20,
      correct: 1,
      wrong: 1,
    });
    expect(missedEarly.xp).toBe(1);

    const recovered = reviewPathVocabulary(missedEarly, word.id, true, now + 20);
    expect(recovered.pathway!.vocabulary[word.id]!.box).toBe(1);
    expect(recovered.xp).toBe(1);
  });

  it("round-trips learned words and migrates pathway saves without vocabulary", () => {
    const learned = learnPathVocabulary(createInitialState(), unit, 1_000);
    expect(parseBackup(createBackup(learned)).state.pathway).toEqual(learned.pathway);

    const legacy = JSON.parse(createBackup(createInitialState())) as {
      state: { pathway: Record<string, unknown> };
    };
    delete legacy.state.pathway["vocabulary"];
    expect(parseBackup(JSON.stringify(legacy)).state.pathway?.vocabulary).toEqual({});
  });
});
