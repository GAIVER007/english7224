import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";

import type { PathUnit } from "@/lib/pathway/types";
import { WritingFeedback } from "./WritingFeedback";

afterEach(cleanup);

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
    minWords: 5,
    model: "I get up early and eat breakfast.",
    checklist: [],
  },
  speaking: { prompt: "", model: "", checklist: [] },
} satisfies PathUnit;

it("checks only on request and focuses the accessible report", () => {
  render(<WritingFeedback text="i work work" unit={unit} />);
  expect(screen.queryByRole("status")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Проверить текст" }));

  const report = screen.getByRole("status");
  expect(report).toHaveFocus();
  expect(report).toHaveTextContent("Слов: 3");
  expect(report).toHaveTextContent("Добавь ещё 2 слова");
  expect(report).toHaveTextContent("местоимение I");
  expect(report).toHaveTextContent("work work");
  expect(report).toHaveTextContent("не оценивают смысл");
});

it("clears a stale report as soon as the parent supplies changed text", () => {
  const { rerender } = render(<WritingFeedback text="i work" unit={unit} />);
  fireEvent.click(screen.getByRole("button", { name: "Проверить текст" }));
  expect(screen.getByRole("status")).toBeInTheDocument();

  rerender(<WritingFeedback text="I work every morning." unit={unit} />);
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

it("identifies an exact model copy and does not present a score", () => {
  render(<WritingFeedback text="I get up early and eat breakfast." unit={unit} />);
  fireEvent.click(screen.getByRole("button", { name: "Проверить текст" }));

  expect(screen.getByText(/Текст совпадает с примером/)).toBeInTheDocument();
  expect(screen.queryByText(/балл|оценка ИИ/i)).not.toBeInTheDocument();
});
