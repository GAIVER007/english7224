import { describe, expect, it } from "vitest";
import { checkDictation, dictationPhrases } from "./dictation";
import { pathUnits } from "./index";
import { createInitialState } from "../store";
import { createBackup, parseBackup } from "../backup";
import { saveUnit } from "./progress";

describe("dictation", () => {
  it("ignores punctuation and case but keeps word order and contractions", () => {
    expect(checkDictation("I'm here, today!", "i’m here today").correct).toBe(true);
    expect(checkDictation("I am here", "here am I").correct).toBe(false);
    expect(checkDictation("I am here", "I'm here").correct).toBe(false);
    expect(checkDictation("Hello", "").correct).toBe(false);
  });
  it("aligns missing, added and replaced words without cascading errors", () => {
    expect(checkDictation("We are at home", "We at home").differences).toEqual([
      { expected: "are", actual: "" },
    ]);
    expect(checkDictation("We are home", "We are now home").differences).toEqual([
      { expected: "", actual: "now" },
    ]);
    expect(checkDictation("We are home", "We were home").differences).toEqual([
      { expected: "are", actual: "were" },
    ]);
  });
  it("provides bounded whole phrases for all 72 units", () => {
    for (const unit of pathUnits) {
      const phrases = dictationPhrases(unit.listening);
      expect(phrases.length, unit.id).toBeGreaterThan(0);
      expect(phrases.length).toBeLessThanOrEqual(3);
      for (const phrase of phrases) expect(unit.listening).toContain(phrase);
    }
  });
  it("preserves drafts and feedback in backups without awarding XP", () => {
    const dictation = [
      { target: "We are home.", draft: "We home", checked: true, revealed: true, completed: false },
    ];
    const state = saveUnit(createInitialState(), "a0-01", { dictation });
    const restored = parseBackup(createBackup(state)).state;
    expect(restored.pathway?.units["a0-01"]?.dictation).toEqual(dictation);
    expect(restored.xp).toBe(0);
  });
});
