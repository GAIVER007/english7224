import { describe, expect, it } from "vitest";
import { appendGrammarResult, grammarAnswerCorrect, grammarTasks } from "./free-trainer";

describe("grammar generator", () => {
  const tasks = grammarTasks();
  it("generates 216 distinct prompts across all nine combinations", () => {
    expect(tasks).toHaveLength(216);
    expect(new Set(tasks.map((task) => task.id)).size).toBe(216);
    for (const tense of ["present", "past", "future"])
      for (const form of ["positive", "negative", "question"]) {
        expect(tasks.filter((task) => task.tense === tense && task.form === form)).toHaveLength(24);
      }
    expect(
      tasks.every((task) => task.ru && task.en && task.rule && !task.ru.includes("undefined")),
    ).toBe(true);
  });
  it("handles third person, past irregular verbs and base forms after auxiliaries", () => {
    const sentence = (id: string) => tasks.find((task) => task.id === id)!.en;
    expect(sentence("She-study-present-positive")).toBe("She studies English.");
    expect(sentence("She-study-present-question")).toBe("Does she study English?");
    expect(sentence("He-read-past-positive")).toBe("He read books.");
    expect(sentence("They-watch-past-negative")).toBe("They did not watch films.");
    expect(sentence("We-cook-future-question")).toBe("Will we cook dinner?");
  });
  it("accepts contractions but rejects wrong auxiliaries and word order", () => {
    expect(grammarAnswerCorrect("She doesn’t study English!", "She does not study English.")).toBe(
      true,
    );
    expect(grammarAnswerCorrect("They won't work at home", "They will not work at home.")).toBe(
      true,
    );
    expect(grammarAnswerCorrect("He'll cook dinner", "He will cook dinner.")).toBe(true);
    expect(grammarAnswerCorrect("Does she studies English?", "Does she study English?")).toBe(
      false,
    );
    expect(grammarAnswerCorrect("She does study English", "Does she study English?")).toBe(false);
  });
  it("keeps precisely the last 100 attempts without mutating the previous history", () => {
    const previous = Array.from({ length: 100 }, () => true);
    const next = appendGrammarResult(previous, false);
    expect(next).toHaveLength(100);
    expect(next[99]).toBe(false);
    expect(previous.every(Boolean)).toBe(true);
  });
});
