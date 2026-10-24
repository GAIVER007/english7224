import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { WordQuiz } from "./WordQuiz";
import { wordPool } from "@/lib/learning";

afterEach(cleanup);
it("keeps options stable and records one answer until next question", () => {
  const onAnswer = vi.fn();
  const words = wordPool.slice(0, 2);
  const { rerender } = render(
    <WordQuiz words={words} pool={wordPool} onAnswer={onAnswer} onDone={vi.fn()} />,
  );
  const options = screen.getAllByRole("button").map((button) => button.textContent);
  fireEvent.click(screen.getByRole("button", { name: words[0]!.ru }));
  fireEvent.click(screen.getByRole("button", { name: words[0]!.ru }));
  rerender(
    <WordQuiz words={[...words]} pool={[...wordPool]} onAnswer={onAnswer} onDone={vi.fn()} />,
  );
  expect(onAnswer).toHaveBeenCalledTimes(1);
  expect(
    screen
      .getAllByRole("button")
      .slice(0, 4)
      .map((button) => button.textContent),
  ).toEqual(options);
  fireEvent.click(screen.getByRole("button", { name: "Дальше" }));
  expect(screen.getByRole("heading")).toHaveTextContent(words[1]!.en);
});
it("requires a passing mini-test and permits a fresh attempt", () => {
  const onDone = vi.fn();
  const words = wordPool.slice(0, 1);
  render(<WordQuiz requirePass words={words} pool={wordPool} onAnswer={vi.fn()} onDone={onDone} />);
  fireEvent.click(
    screen
      .getAllByRole("button")
      .find((button) => button !== screen.getByRole("button", { name: words[0]!.ru }))!,
  );
  fireEvent.click(screen.getByRole("button", { name: "Дальше" }));
  expect(onDone).not.toHaveBeenCalled();
  expect(screen.queryByRole("button", { name: "Продолжить" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Повторить мини-тест" }));
  fireEvent.click(screen.getByRole("button", { name: words[0]!.ru }));
  fireEvent.click(screen.getByRole("button", { name: "Дальше" }));
  fireEvent.click(screen.getByRole("button", { name: "Продолжить" }));
  expect(onDone).toHaveBeenCalledTimes(1);
});
