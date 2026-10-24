import { describe, expect, it } from "vitest";
import { lessons } from "./content";
import { createInitialState } from "./store";
import { mistakeWords } from "./mistakes";

describe("targeted mistake practice", () => {
  it("excludes unseen words, mastered words and words without errors", () => {
    const words = lessons[0]!.words;
    const state = {
      ...createInitialState(),
      cards: {
        [words[0]!.id]: { box: 2, due: 0, correct: 3, wrong: 10 },
        [words[1]!.id]: { box: 0, due: 0, correct: 0, wrong: 0 },
        [words[2]!.id]: { box: 0, due: 0, correct: 0, wrong: 1 },
      },
    };
    expect(mistakeWords(state).map((word) => word.id)).toEqual([words[2]!.id]);
    expect(mistakeWords(createInitialState())).toEqual([]);
  });
  it("prioritizes least consolidated words and caps a session at five", () => {
    const words = lessons.flatMap((lesson) => lesson.words).slice(0, 8);
    const state = {
      ...createInitialState(),
      cards: Object.fromEntries(
        words.map((word, index) => [
          word.id,
          { box: index === 7 ? 0 : 1, due: 0, correct: 0, wrong: index + 1 },
        ]),
      ),
    };
    const selected = mistakeWords(state);
    expect(selected).toHaveLength(5);
    expect(selected[0]!.id).toBe(words[7]!.id);
    expect(selected[1]!.id).toBe(words[6]!.id);
  });
});
