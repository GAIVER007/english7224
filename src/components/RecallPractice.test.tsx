import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { RecallPractice } from "@/components/RecallPractice";
import type { Word } from "@/lib/content";

const makeWord = (id: string, en: string, ru: string): Word => ({
  id,
  en,
  ru,
  ipa: "",
  example: `Example with ${en}.`,
  exampleRu: `Пример с ${ru}.`,
  phrases: [],
});

const menu = makeWord("menu", "menu", "меню");

afterEach(cleanup);

describe("RecallPractice", () => {
  it("keeps a typo incorrect, retries it, and reports the original question only once", () => {
    const onAnswer = vi.fn();
    render(<RecallPractice words={[menu]} onAnswer={onAnswer} onDone={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Твой ответ на английском"), {
      target: { value: "meny" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Проверить" }));
    expect(screen.getByText("Пока нет. Правильный ответ: menu")).toBeInTheDocument();
    expect(screen.getByText("Example with menu.")).toBeInTheDocument();
    expect(onAnswer).toHaveBeenCalledWith("menu", false);

    fireEvent.click(screen.getByRole("button", { name: "Продолжить" }));
    expect(screen.getByText("Повторяем ошибку")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Твой ответ на английском"), {
      target: { value: "MENU!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Проверить" }));
    fireEvent.click(screen.getByRole("button", { name: "Продолжить" }));

    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("heading", { name: "Есть что повторить — и это нормально" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("С первой попытки: 0 из 1");
  });

  it("treats revealing as one incorrect answer and still makes the learner retry", () => {
    const onAnswer = vi.fn();
    render(<RecallPractice words={[menu]} onAnswer={onAnswer} onDone={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Показать ответ" }));
    expect(screen.getByText("Ответ: menu")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Продолжить" }));

    expect(screen.getByText("Повторяем ошибку")).toBeInTheDocument();
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith("menu", false);
  });

  it("takes a shuffled snapshot of at most five words", () => {
    const words = Array.from({ length: 7 }, (_, index) =>
      makeWord(`word-${index}`, `word ${index}`, `слово ${index}`),
    );
    render(<RecallPractice words={words} onAnswer={vi.fn()} onDone={vi.fn()} />);

    expect(screen.getByText(/1 из 5$/)).toBeInTheDocument();
  });

  it("shows a useful empty state and completes from it", () => {
    const onDone = vi.fn();
    render(<RecallPractice words={[]} onAnswer={vi.fn()} onDone={onDone} />);

    expect(screen.getByRole("heading", { name: "Сначала изучим слова" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Готово" }));
    expect(onDone).toHaveBeenCalledOnce();
  });

  it("submits by keyboard, ignores empty submissions, and normalizes curly apostrophes", () => {
    const phrase = makeWord("like", "I'd like", "я бы хотел");
    const onAnswer = vi.fn();
    render(<RecallPractice words={[phrase]} onAnswer={onAnswer} onDone={vi.fn()} />);
    const input = screen.getByLabelText("Твой ответ на английском");
    const form = input.closest("form")!;

    expect(screen.getByRole("button", { name: "Проверить" })).toBeDisabled();
    fireEvent.submit(form);
    expect(onAnswer).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: "  I’d   LIKE. " } });
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(screen.getByText("Верно! Вспомнил самостоятельно.")).toBeInTheDocument();
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith("like", true);
  });

  it("shows context for an ambiguous prompt without weakening exact recall", () => {
    const onAnswer = vi.fn();
    render(
      <RecallPractice
        words={[
          {
            ...menu,
            recallHint: "Точное выражение из темы · 2 слова",
          },
        ]}
        onAnswer={onAnswer}
        onDone={vi.fn()}
      />,
    );

    expect(screen.getByText("Точное выражение из темы · 2 слова")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Твой ответ на английском"), {
      target: { value: "food list" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Проверить" }));

    expect(onAnswer).toHaveBeenCalledWith("menu", false);
  });
});
