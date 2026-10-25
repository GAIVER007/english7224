import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { GrammarQuestion, GrammarRound } from "./FreeTrainer";
import { grammarTasks } from "@/lib/free-trainer";

afterEach(cleanup);
const task = grammarTasks().find((item) => item.id === "He-work-present-positive")!;
it("builds a sentence from buttons and submits an answer only once", () => {
  const answer = vi.fn();
  render(<GrammarQuestion task={task} typed={false} onAnswer={answer} onNext={vi.fn()} />);
  for (const word of ["He", "works", "at", "home"])
    fireEvent.click(screen.getByRole("button", { name: word }));
  const submit = screen.getByRole("button", { name: "Проверить" });
  fireEvent.click(submit);
  fireEvent.click(submit);
  expect(answer).toHaveBeenCalledExactlyOnceWith(true);
  expect(screen.getByRole("status")).toHaveTextContent("Верно самостоятельно!");
});
it("does not count a hinted correct answer as independent recall", () => {
  const answer = vi.fn();
  render(<GrammarQuestion task={task} typed onAnswer={answer} onNext={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Подсказка по конструкции" }));
  fireEvent.change(screen.getByLabelText("Твой перевод"), { target: { value: task.en } });
  fireEvent.click(screen.getByRole("button", { name: "Проверить" }));
  expect(answer).toHaveBeenCalledExactlyOnceWith(false);
  expect(screen.getByRole("status")).toHaveTextContent("Верно с подсказкой");
});
it("keeps mistakes for a focused round and awards completion once", () => {
  const complete = vi.fn();
  const next = vi.fn();
  render(
    <GrammarRound
      tasks={[task]}
      typed
      onAnswer={vi.fn()}
      onComplete={complete}
      onNext={next}
      onExit={vi.fn()}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Пока не знаю — разобрать" }));
  fireEvent.click(screen.getByRole("button", { name: "Дальше" }));
  expect(screen.getByRole("status")).toHaveTextContent("Самостоятельно: 0 из 1");
  expect(complete).not.toHaveBeenCalled();
  const retry = screen.getByRole("button", { name: "Повторить сложные (1)" });
  fireEvent.click(retry);
  fireEvent.click(retry);
  expect(complete).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledWith([task]);
});

it("passes the phrase id so an incorrect answer can be restored for later practice", () => {
  const answer = vi.fn();
  render(
    <GrammarRound
      tasks={[task]}
      typed
      onAnswer={answer}
      onComplete={vi.fn()}
      onNext={vi.fn()}
      onExit={vi.fn()}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Пока не знаю — разобрать" }));
  expect(answer).toHaveBeenCalledExactlyOnceWith(false, task.id);
  expect(screen.getByRole("button", { name: "Послушать фразу" })).toBeInTheDocument();
});
