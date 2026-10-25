import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialState, resetAppState, updateAppState } from "@/lib/store";
import { pathUnits } from "@/lib/pathway";
import { emptyPath, emptyUnit } from "@/lib/pathway/state";

const { routeSearch } = vi.hoisted(() => ({
  routeSearch: { value: {} as { unit?: string; exam?: string } },
}));

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: { component: ComponentType }) => ({
    options,
    useSearch: () => routeSearch.value,
  }),
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

vi.mock("@/components/TrainingUI", () => ({
  TrainingHeader: ({ title, detail }: { title: string; detail?: string }) => (
    <header>
      <p>{title}</p>
      {detail && <p>{detail}</p>}
    </header>
  ),
  BottomNav: () => <nav aria-label="Нижняя навигация" />,
}));

import { Route } from "./course";

const Course = Route.options.component as ComponentType;
const unit = pathUnits[0]!;

function seedUnit(values: Partial<ReturnType<typeof emptyUnit>>) {
  updateAppState(() => ({
    ...createInitialState(),
    pathway: {
      ...emptyPath(),
      units: { [unit.id]: { ...emptyUnit(), ...values } },
    },
  }));
  routeSearch.value = { unit: unit.id };
}

afterEach(() => {
  cleanup();
  routeSearch.value = {};
  resetAppState();
});

describe("course unit session", () => {
  it("keeps a writing draft after remount and clears stale self-checks when it changes", () => {
    seedUnit({
      stage: 3,
      writing: "My first saved version.",
      writingChecks: [true, true, true],
    });

    const first = render(<Course />);
    const editor = screen.getByLabelText(`Твой текст · минимум ${unit.writing.minWords} слов`);
    expect(editor).toHaveValue("My first saved version.");
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
    expect(
      screen.getAllByRole("checkbox").every((item) => (item as HTMLInputElement).checked),
    ).toBe(true);

    fireEvent.change(editor, { target: { value: "My revised draft stays on this device." } });
    expect(
      screen.getAllByRole("checkbox").every((item) => !(item as HTMLInputElement).checked),
    ).toBe(true);

    first.unmount();
    render(<Course />);
    expect(screen.getByLabelText(`Твой текст · минимум ${unit.writing.minWords} слов`)).toHaveValue(
      "My revised draft stays on this device.",
    );

    const saved = JSON.parse(localStorage.getItem("speakup-state-v1")!);
    expect(saved.pathway.units[unit.id]).toMatchObject({
      writing: "My revised draft stays on this device.",
      writingChecks: [false, false, false],
    });
  });

  it("does not allow a completed answer sheet to bypass writing and speaking production", () => {
    seedUnit({
      stage: 5,
      answers: Object.fromEntries(
        unit.questions.map((question, index) => [index, question.answer]),
      ),
    });

    render(<Course />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Сначала закончи письмо и отметь критерии самопроверки письма и речи.",
    );
    expect(screen.getByRole("button", { name: "Проверить ответы" })).toBeDisabled();
    expect(
      JSON.parse(localStorage.getItem("speakup-state-v1")!).pathway.units[unit.id].attempts,
    ).toBe(0);
  });

  it("saves selected answers and records one result for a completed submission", () => {
    seedUnit({
      stage: 5,
      writing: Array.from({ length: unit.writing.minWords }, () => "word").join(" "),
      writingChecks: [true, true, true],
      speakingChecks: [true, true, true],
    });

    render(<Course />);
    const groups = Array.from(document.querySelectorAll("fieldset"));
    expect(groups).toHaveLength(6);
    unit.questions.forEach((question, index) => {
      fireEvent.click(within(groups[index]!).getByLabelText(question.answer));
    });

    const submit = screen.getByRole("button", { name: "Проверить ответы" });
    expect(submit).toBeEnabled();
    fireEvent.click(submit);

    expect(screen.getByRole("heading", { name: "Тема пройдена · 6/6" })).toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem("speakup-state-v1")!);
    expect(saved.pathway.units[unit.id]).toMatchObject({
      answers: Object.fromEntries(
        unit.questions.map((question, index) => [index, question.answer]),
      ),
      submitted: true,
      passed: true,
      best: 6,
      attempts: 1,
    });
    expect(saved.pathway.history).toHaveLength(1);
    expect(saved.pathway.history[0]).toMatchObject({
      id: unit.id,
      correct: 6,
      total: 6,
      passed: true,
    });
  });
});
