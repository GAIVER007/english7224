import { describe, it, expect } from "vitest";
import { review } from "./store";

describe("spaced repetition", () => {
  it("correct answer increases interval", () => {
    const c = review({ box: 1, due: 0, correct: 1, wrong: 0 }, true, 0);
    expect(c.box).toBe(2);
    expect(c.due).toBe(3 * 86400000);
  });
  it("mistake returns word sooner", () => {
    const c = review({ box: 3, due: 0, correct: 3, wrong: 0 }, false, 0);
    expect(c.box).toBe(0);
    expect(c.due).toBe(0);
  });
});
