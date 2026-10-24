import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Assessment } from "./Assessment";
import type { AssessmentQuestion } from "@/lib/assessment";

afterEach(cleanup);
const questions = (): AssessmentQuestion[] =>
  Array.from({ length: 7 }, (_, i) => ({
    id: `q${i}`,
    area: "Память",
    prompt: `Слово ${i}`,
    answer: "ticket",
    explanation: "ticket — билет",
    wordId: `w${i}`,
  }));

function answer(correct: boolean, last: boolean) {
  if (correct) {
    fireEvent.change(screen.getByLabelText("Ответ на английском"), {
      target: { value: "Ticket!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Проверить ответ" }));
  } else fireEvent.click(screen.getByRole("button", { name: "Пока не помню" }));
  fireEvent.click(
    screen.getByRole("button", { name: last ? "Показать результат" : "Следующий вопрос" }),
  );
}

it("requires 80 percent and submits the first-attempt score only on completion", () => {
  const onFinish = vi.fn();
  const onAnswer = vi.fn();
  render(<Assessment makeQuestions={questions} onFinish={onFinish} onAnswer={onAnswer} />);
  for (let i = 0; i < 7; i++) answer(i < 6, i === 6);
  expect(screen.getByRole("heading", { name: "Экзамен сдан" })).toBeInTheDocument();
  expect(onFinish).not.toHaveBeenCalled();
  const button = screen.getByRole("button", { name: "Завершить экзамен" });
  fireEvent.click(button);
  fireEvent.click(button);
  expect(onFinish).toHaveBeenCalledExactlyOnceWith({ correct: 6, total: 7 });
  expect(onAnswer).toHaveBeenCalledTimes(7);
});

it("records failure and starts a fresh attempt without carrying correct answers", () => {
  const onFinish = vi.fn();
  render(<Assessment makeQuestions={questions} onFinish={onFinish} />);
  for (let i = 0; i < 7; i++) answer(i < 5, i === 6);
  expect(screen.queryByRole("button", { name: "Завершить экзамен" })).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Разбор ошибок" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Разобрать и повторить" }));
  expect(onFinish).toHaveBeenCalledExactlyOnceWith({ correct: 5, total: 7 });
  expect(screen.getByText(/Вопрос 1 из 7/)).toBeInTheDocument();
  expect(screen.getByLabelText("Ответ на английском")).toHaveValue("");
});

it("keeps a failed recalled word due even if its later comprehension answer is correct", () => {
  const onAnswer = vi.fn();
  render(
    <Assessment
      makeQuestions={() =>
        questions()
          .slice(0, 2)
          .map((q) => ({ ...q, wordId: "same" }))
      }
      onFinish={vi.fn()}
      onAnswer={onAnswer}
    />,
  );
  answer(false, false);
  answer(true, true);
  expect(onAnswer).toHaveBeenCalledExactlyOnceWith("same", false);
});
