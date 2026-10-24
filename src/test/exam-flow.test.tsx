import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { createInitialState, resetAppState, updateAppState } from "@/lib/store";
import { wordPool } from "@/lib/learning";

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: { component: ComponentType }) => ({ options }),
  Link: ({ children, to, className }: { children: ReactNode; to: string; className?: string }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));
import { Route } from "@/routes/weekly";
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  resetAppState();
});
const Exam = Route.options.component as ComponentType;
it("offers a useful empty state instead of testing unstudied material", () => {
  resetAppState();
  render(<Exam />);
  expect(screen.getByRole("heading", { name: "Сначала изучите новые слова" })).toBeInTheDocument();
});
it("saves the completed result and includes the last answer", () => {
  updateAppState(() => ({
    ...createInitialState(),
    level: "A2",
    cards: Object.fromEntries(
      wordPool.slice(0, 3).map((word) => [word.id, { box: 1, due: 100, correct: 1, wrong: 0 }]),
    ),
  }));
  render(<Exam />);
  let correct = 0;
  for (let i = 0; i < 3; i++) {
    fireEvent.click(
      screen.getAllByRole("button").find((button) => button.classList.contains("option"))!,
    );
    if (screen.queryByText("Верно.") !== null) correct++;
    fireEvent.click(
      screen.getByRole("button", { name: i === 2 ? "Показать результат" : "Дальше" }),
    );
  }
  expect(screen.getByRole("heading", { name: "Результат проверки" })).toBeInTheDocument();
  const state = JSON.parse(localStorage.getItem("speakup-state-v1")!);
  expect(state.weeklyResult.total).toBe(3);
  expect(state.weeklyResult.correct).toBe(correct);
  expect(state.weeklyResult.completedAt).toBeGreaterThan(0);
});

it("replaces runtime-failed audio without recording an invented mistake", () => {
  vi.stubGlobal("speechSynthesis", {
    cancel: vi.fn(),
    speak: () => {
      throw new Error("voice unavailable");
    },
  });
  vi.stubGlobal(
    "SpeechSynthesisUtterance",
    class {
      constructor(public text: string) {}
    },
  );
  updateAppState(() => ({
    ...createInitialState(),
    level: "A2",
    cards: Object.fromEntries(
      wordPool.slice(0, 3).map((word) => [word.id, { box: 1, due: 100, correct: 1, wrong: 0 }]),
    ),
  }));
  render(<Exam />);
  for (let i = 0; i < 2; i++) {
    fireEvent.click(
      screen.getAllByRole("button").find((button) => button.classList.contains("option"))!,
    );
    fireEvent.click(screen.getByRole("button", { name: "Дальше" }));
  }
  const before = JSON.parse(localStorage.getItem("speakup-state-v1")!);
  expect(screen.getByRole("heading", { name: "Что вы услышали?" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Прослушать" }));
  expect(screen.queryByRole("heading", { name: "Что вы услышали?" })).not.toBeInTheDocument();
  expect(screen.getByRole("heading")).toHaveTextContent("Как сказать:");
  expect(
    screen.getByText("Озвучка недоступна. Аудирование заменено заданиями на фразы."),
  ).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem("speakup-state-v1")!)).toEqual(before);
});
