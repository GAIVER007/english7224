import { describe, expect, it } from "vitest";
import { analyzeWriting } from "./writing-feedback";
import type { PathUnit } from "./types";

const unit = {
  id: "a1-test",
  level: "A1",
  title: "Test",
  goal: "Test",
  theory: "Test",
  examples: [],
  vocabulary: [],
  reading: "",
  listening: "",
  questions: [],
  writing: {
    prompt: "Write about your day.",
    minWords: 8,
    model: "I get up early, and I have breakfast before work.",
    checklist: [],
  },
  speaking: { prompt: "", model: "", checklist: [] },
} satisfies PathUnit;

describe("local writing feedback", () => {
  it("reports exact text statistics and the word minimum separately from hints", () => {
    const report = analyzeWriting("I work. I study English!", unit);
    expect(report.statistics).toEqual({ words: 5, sentences: 2, characters: 24 });
    expect(report.minimum).toEqual({ required: 8, met: false, missing: 3 });
    expect(report.hints).toEqual([]);
  });

  it("flags Cyrillic, mixed alphabets, lowercase i and narrow agreement mistakes", () => {
    const cyrillic = analyzeWriting("I live in Москва.", unit);
    expect(cyrillic.hints.map((hint) => hint.kind)).toContain("cyrillic");

    const report = analyzeWriting("i think cаt is nice. He are friendly.", unit);
    expect(report.hints.map((hint) => hint.kind)).toEqual([
      "mixed-script",
      "lowercase-i",
      "agreement",
    ]);
  });

  it("finds accidental repeats but leaves valid had had and that that constructions alone", () => {
    const report = analyzeWriting(
      "I really really agree. The meal I had had tasted better than that that day.",
      unit,
    );
    expect(report.hints).toEqual([
      expect.objectContaining({
        kind: "repeated-word",
        message: expect.stringContaining("really"),
      }),
    ]);
  });

  it("does not treat the same word across sentence punctuation as an adjacent repeat", () => {
    const report = analyzeWriting("I see. See you tomorrow.", unit);
    expect(report.hints.map((hint) => hint.kind)).not.toContain("repeated-word");
  });

  it("uses the same whitespace word count as the pathway completion gate", () => {
    const report = analyzeWriting("One two—three four", unit);
    expect(report.statistics.words).toBe(3);
    expect(report.minimum.missing).toBe(5);
  });

  it("does not flag grammatical text that mentions the letter I", () => {
    const report = analyzeWriting("The letter I is always capitalized.", unit);
    expect(report.hints.map((hint) => hint.kind)).not.toContain("agreement");
  });

  it("does not inspect quoted examples and limits the number of heuristic hints", () => {
    const report = analyzeWriting(
      "My teacher wrote “i i”. i use слоvo twice twice. I is ready.",
      unit,
    );
    expect(report.hints).toHaveLength(4);
    expect(report.hints.map((hint) => hint.kind)).toEqual([
      "mixed-script",
      "lowercase-i",
      "repeated-word",
      "agreement",
    ]);
  });

  it("recognizes a normalized exact copy of the model without grading similar answers", () => {
    expect(
      analyzeWriting("I GET UP EARLY — and I have breakfast before work!", unit).copiedModel,
    ).toBe(true);
    expect(analyzeWriting("I get up early and then eat before work.", unit).copiedModel).toBe(
      false,
    );
  });
});
