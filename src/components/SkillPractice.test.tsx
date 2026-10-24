import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Dialogue, Dictation, Retell, SkillPractice } from "./SkillPractice";
import { lessons } from "@/lib/content";
import { createInitialState } from "@/lib/store";

vi.mock("@/lib/speech", () => ({ isSpeechSynthesisAvailable: () => true }));
afterEach(cleanup);
const lesson = lessons[0]!;

it("offers only completed missions and protects first-time learners", () => {
  const { rerender } = render(<SkillPractice state={createInitialState()} onDone={vi.fn()} />);
  expect(screen.getByText("Сначала одна миссия")).toBeInTheDocument();
  rerender(
    <SkillPractice
      key="ready"
      state={{ ...createInitialState(), steps: { "1:test": true } }}
      onDone={vi.fn()}
    />,
  );
  expect(screen.getAllByRole("option")).toHaveLength(1);
  expect(screen.getByRole("button", { name: /Аудиодиктант/ })).toBeInTheDocument();
});

it("scores only unassisted dictation attempts and retains phrases needing practice", () => {
  const done = vi.fn();
  render(<Dictation lesson={lesson} onDone={done} />);
  lesson.words.slice(0, 3).forEach((word, index) => {
    if (index === 1) fireEvent.click(screen.getByRole("button", { name: /Показать текст/ }));
    fireEvent.change(screen.getByLabelText("Фраза на английском"), {
      target: { value: index === 2 ? "wrong phrase" : word.example.toUpperCase() },
    });
    fireEvent.click(screen.getByRole("button", { name: "Проверить фразу" }));
    fireEvent.click(
      screen.getByRole("button", { name: index === 2 ? "Результат" : "Следующая фраза" }),
    );
  });
  expect(screen.getByRole("status")).toHaveTextContent("Без подсказки: 1 из 3");
  expect(screen.getByText(/Использован текст или озвучка недоступна/)).toBeInTheDocument();
  expect(screen.getByText(lesson.words[1]!.example)).toBeInTheDocument();
  expect(done).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Завершить тренировку" }));
  expect(done).toHaveBeenCalledTimes(1);
});

it("handles an audio failure and offers a visible text fallback", () => {
  render(<Dictation lesson={lesson} onDone={vi.fn()} />);
  fireEvent(window, new Event("speakup-audio-error"));
  expect(screen.getByRole("status")).toHaveTextContent("Озвучка недоступна");
  expect(screen.queryByRole("button", { name: "Послушать" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Показать текст/ }));
  expect(screen.getByText(lesson.words[0]!.example)).toBeInTheDocument();
});

it("hides the retelling script and requires self-checks again after consulting it", () => {
  render(<Retell lesson={lesson} onDone={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Спрятать диалог и начать" }));
  expect(screen.queryByText(lesson.dialogue[0]!.en)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Завершить пересказ" })).toBeDisabled();
  screen.getAllByRole("checkbox").forEach((box) => fireEvent.click(box));
  expect(screen.getByRole("button", { name: "Завершить пересказ" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Посмотреть диалог снова" }));
  fireEvent.click(screen.getByRole("button", { name: "Спрятать диалог и начать" }));
  expect(screen.getByRole("button", { name: "Завершить пересказ" })).toBeDisabled();
});

it("lets a learner give a different dialogue response without declaring it wrong", () => {
  render(<Dialogue lesson={lesson} onDone={vi.fn()} />);
  expect(screen.queryByText(lesson.dialogue[1]!.en)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Сравнить с примером" })).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Твоя реплика на английском"), {
    target: { value: "Yes, please follow me." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Сравнить с примером" }));
  expect(screen.getByText("Один из вариантов")).toBeInTheDocument();
  expect(screen.getByText(/Автоматической оценки свободного ответа/)).toBeInTheDocument();
});

it("requires three separate spoken attempts before fluency completion", () => {
  const done = vi.fn();
  render(
    <SkillPractice state={{ ...createInitialState(), steps: { "1:test": true } }} onDone={done} />,
  );
  fireEvent.click(screen.getByRole("button", { name: /Говорить свободнее/ }));
  for (let round = 0; round < 3; round++) {
    const button = screen.getByRole("button", {
      name: round < 2 ? "Следующий рассказ" : "Завершить практику беглости",
    });
    expect(button).toBeDisabled();
    fireEvent.click(screen.getByRole("checkbox", { name: "Я рассказал вслух" }));
    fireEvent.click(button);
  }
  expect(done).toHaveBeenCalledExactlyOnceWith("fluency");
  expect(screen.queryByLabelText("Опорные слова (необязательно)")).not.toBeInTheDocument();
});
