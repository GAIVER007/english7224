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
  expect(screen.getByRole("button", { name: "Мини-тест" })).toBeDisabled();
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
  for (const word of lessons[0]!.words) {
    fireEvent.click(screen.getByRole("button", { name: word.ru }));
    fireEvent.click(screen.getByRole("button", { name: "Дальше" }));
  }
  expect(screen.getByRole("heading", { name: "Результат: 6 из 6" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Продолжить" }));
  const saved = JSON.parse(localStorage.getItem("speakup-state-v1")!);
  expect(saved.day).toBe(2);
  expect(saved.xp).toBe(60);
  expect(Object.keys(saved.steps)).toHaveLength(6);
  expect(navigate).toHaveBeenCalledWith({ to: "/" });
});
