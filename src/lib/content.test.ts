import { describe, expect, it } from "vitest";

import { lessons } from "@/lib/content";

describe("lesson content", () => {
  it("keeps a consecutive ten-day A2 course", () => {
    expect(lessons).toHaveLength(10);
    expect(lessons.map((lesson) => lesson.day)).toEqual(
      Array.from({ length: lessons.length }, (_, index) => index + 1),
    );
    expect(lessons.every((lesson) => lesson.level === "A2")).toBe(true);
  });

  it("uses a globally unique id for every word", () => {
    const ids = lessons.flatMap((lesson) => lesson.words.map((word) => word.id));

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("provides six complete practice words in each new lesson", () => {
    for (const lesson of lessons.slice(5)) {
      expect(lesson.words, `day ${lesson.day}`).toHaveLength(6);
      for (const word of lesson.words) {
        expect(word.en.trim()).not.toBe("");
        expect(word.ru.trim()).not.toBe("");
        expect(word.ipa.trim()).not.toBe("");
        expect(word.example.trim()).not.toBe("");
        expect(word.exampleRu.trim()).not.toBe("");
        expect(word.phrases.length).toBeGreaterThanOrEqual(2);
        expect(word.phrases.every((phrase) => phrase.en.trim() && phrase.ru.trim())).toBe(true);
      }
    }
  });

  it("gives every lesson enough material for dialogue, speaking, and grammar practice", () => {
    for (const lesson of lessons) {
      expect(lesson.title.trim()).not.toBe("");
      expect(lesson.titleRu.trim()).not.toBe("");
      expect(lesson.dialogue.length, `dialogue day ${lesson.day}`).toBeGreaterThanOrEqual(4);
      expect(new Set(lesson.dialogue.map((line) => line.who))).toEqual(new Set(["A", "B"]));
      expect(lesson.dialogue.every((line) => line.en.trim() && line.ru.trim())).toBe(true);
      expect(lesson.speaking.length, `speaking day ${lesson.day}`).toBeGreaterThanOrEqual(2);
      expect(lesson.speaking.every((item) => item.prompt.trim() && item.target.trim())).toBe(true);
      expect(lesson.grammar.title.trim()).not.toBe("");
      expect(lesson.grammar.rule.trim()).not.toBe("");
      expect(lesson.grammar.examples.length).toBeGreaterThanOrEqual(3);
      expect(lesson.grammar.examples.every((example) => example.trim())).toBe(true);
    }
  });
});
