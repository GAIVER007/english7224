import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { createInitialState, resetAppState, updateAppState } from "@/lib/store";
import { lessons } from "@/lib/content";

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: { component: ComponentType }) => ({
    options,
    useSearch: () => ({ review: undefined }),
  }),
  useNavigate: () => navigate,
  Link: ({ children, to, className }: { children: ReactNode; to: string; className?: string }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));
vi.mock("@/lib/learning", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/learning")>()),
  shuffle: <T,>(items: readonly T[]) => [...items],
}));
import { Route } from "@/routes/lesson";

afterEach(() => {
  cleanup();
  resetAppState();
  navigate.mockClear();
});
it("completes every lesson stage, resumes after remount, and advances once", () => {
  updateAppState(() => ({ ...createInitialState(), level: "A2" }));
  const Lesson = Route.options.component as ComponentType;
  const first = render(<Lesson />);
  expect(screen.getByRole("button", { name: "Мини-экзамен" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Дальше" }));
  first.unmount();
  render(<Lesson />);
  expect(screen.getByRole("heading", { name: "menu" })).toBeInTheDocument();
  for (const word of lessons[0]!.words) {
    expect(screen.getByRole("heading", { name: word.en })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Запомнил" }));
  }
  fireEvent.click(screen.getByRole("button", { name: "Готово" }));
  fireEvent.click(screen.getByRole("button", { name: "Готово" }));
  expect(screen.getByRole("button", { name: "Дальше" })).toBeDisabled();
  for (const [index] of lessons[0]!.speaking.entries()) {
    fireEvent.click(screen.getByRole("checkbox", { name: "Я произнёс фразу самостоятельно" }));
    fireEvent.click(
      screen.getByRole("button", {
        name: index + 1 === lessons[0]!.speaking.length ? "Завершить" : "Дальше",
      }),
    );
  }
  for (const word of lessons[0]!.words.slice(0, 4)) {
    fireEvent.change(screen.getByLabelText("Ответ на английском"), { target: { value: word.en } });
    fireEvent.click(screen.getByRole("button", { name: "Проверить ответ" }));
    fireEvent.click(screen.getByRole("button", { name: "Следующий вопрос" }));
  }
  for (const word of lessons[0]!.words.slice(0, 2)) {
    fireEvent.click(screen.getByRole("button", { name: word.exampleRu }));
    fireEvent.click(screen.getByRole("button", { name: "Следующий вопрос" }));
  }
  fireEvent.click(screen.getByRole("button", { name: lessons[0]!.grammarQuiz.answer }));
  fireEvent.click(screen.getByRole("button", { name: "Показать результат" }));
  expect(screen.getByRole("heading", { name: "Экзамен сдан" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Завершить экзамен" }));
  const saved = JSON.parse(localStorage.getItem("speakup-state-v1")!);
  expect(saved.day).toBe(2);
  expect(saved.examResults["lesson:1"]).toMatchObject({ correct: 7, total: 7, passed: true });
  expect(saved.xp).toBe(60);
  expect(Object.keys(saved.steps)).toHaveLength(6);
  expect(navigate).toHaveBeenCalledWith({ to: "/" });
});

it("shows the mandatory module exam instead of mission six after five completed missions", () => {
  updateAppState(() => ({ ...createInitialState(), level: "A2", day: 6 }));
  const Lesson = Route.options.component as ComponentType;
  render(<Lesson />);
  expect(screen.getByText("Экзамен модуля 1")).toBeInTheDocument();
  expect(screen.getByText(/Вопрос 1 из 15/)).toBeInTheDocument();
  expect(screen.queryByRole("navigation", { name: "Этапы урока" })).not.toBeInTheDocument();
});
