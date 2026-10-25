import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialState, resetAppState, updateAppState } from "@/lib/store";
import { pathUnits, levelQuestions, unitsForLevel } from "@/lib/pathway";
import { emptyPath, emptyUnit } from "@/lib/pathway/state";

const { routeSearch } = vi.hoisted(() => ({
  routeSearch: { value: {} as { unit?: string; exam?: string; review?: string } },
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
  useNavigate: () => vi.fn(),
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

  it("adds unit words and records a due active-recall answer", () => {
    seedUnit({ stage: 0 });
    const first = render(<Course />);

    fireEvent.click(screen.getByRole("button", { name: "Добавить 6 слов в повторение" }));
    expect(screen.getByRole("link", { name: "Вспомнить 5 слов · осталось 6" })).toBeInTheDocument();
    expect(
      Object.keys(JSON.parse(localStorage.getItem("speakup-state-v1")!).pathway.vocabulary),
    ).toHaveLength(6);

    first.unmount();
    routeSearch.value = { review: unit.id };
    render(<Course />);
    expect(screen.getByText("В этой тренировке до 5 слов.", { exact: false })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Твой ответ на английском"), {
      target: { value: "letter" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Проверить" }));

    const saved = JSON.parse(localStorage.getItem("speakup-state-v1")!);
    expect(saved.pathway.vocabulary["a0-01:v:letter"]).toMatchObject({
      box: 1,
      correct: 1,
      wrong: 0,
    });
    expect(saved.xp).toBe(1);
  });
  it("keeps feedback and results visible after the last due word is answered", () => {
    updateAppState(() => ({
      ...createInitialState(),
      pathway: {
        ...emptyPath(),
        vocabulary: { "a0-01:v:letter": { box: 0, due: 0, correct: 0, wrong: 0 } },
      },
    }));
    routeSearch.value = { review: "due" };
    render(<Course />);
    fireEvent.change(screen.getByLabelText("Твой ответ на английском"), {
      target: { value: "letter" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Проверить" }));
    expect(screen.getByText("Верно! Вспомнил самостоятельно.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Продолжить" }));
    expect(screen.getByRole("heading", { name: "Отлично закреплено!" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Завершить практику" })).toBeInTheDocument();
  });
  it("grades a new exam and keeps skill results and revision links", () => {
    const questions = levelQuestions("A0");
    updateAppState(() => ({
      ...createInitialState(),
      pathway: {
        ...emptyPath(),
        units: Object.fromEntries(
          unitsForLevel("A0").map((u) => [u.id, { ...emptyUnit(), passed: true, best: 6 }]),
        ),
        exams: {
          A0: {
            version: 2,
            answers: Object.fromEntries(
              questions.map((q, i) => [
                q.id,
                i === 0 ? q.options.find((o) => o !== q.answer)! : q.answer,
              ]),
            ),
            submitted: false,
            passed: false,
            best: 0,
            attempts: 0,
          },
        },
      },
    }));
    routeSearch.value = { exam: "A0" };
    render(<Course />);
    expect(screen.queryByText("Текст аудио для разбора")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Завершить контрольную" }));
    expect(screen.getByRole("heading", { name: "Результат: 23/24" })).toBeInTheDocument();
    expect(screen.getByText("Грамматика: 7/8")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Что повторить" })).toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem("speakup-state-v1")!);
    expect(saved.pathway.history[0].reviewUnitIds).toEqual([questions[0]!.unitId]);
    fireEvent.click(screen.getByRole("button", { name: "Новая попытка" }));
    expect(screen.getByRole("button", { name: "Завершить контрольную" })).toBeDisabled();
    expect(JSON.parse(localStorage.getItem("speakup-state-v1")!).pathway.exams.A0.version).toBe(2);
  });
  it("preserves a submitted legacy exam and switches its retake to the new bank", () => {
    const questions = levelQuestions("A0", 1);
    updateAppState(() => ({
      ...createInitialState(),
      xp: 50,
      pathway: {
        ...emptyPath(),
        units: Object.fromEntries(
          unitsForLevel("A0").map((u) => [u.id, { ...emptyUnit(), passed: true, best: 6 }]),
        ),
        exams: {
          A0: {
            answers: Object.fromEntries(questions.map((q) => [q.id, q.answer])),
            submitted: true,
            passed: true,
            best: 24,
            attempts: 1,
          },
        },
      },
    }));
    routeSearch.value = { exam: "A0" };
    render(<Course />);
    expect(screen.getByRole("heading", { name: "Результат: 24/24" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Новая попытка" }));
    expect(screen.getByRole("button", { name: "Завершить контрольную" })).toBeDisabled();
    const saved = JSON.parse(localStorage.getItem("speakup-state-v1")!);
    expect(saved.pathway.exams.A0).toMatchObject({
      version: 2,
      answers: {},
      passed: true,
      best: 24,
      attempts: 1,
    });
    expect(saved.xp).toBe(50);
  });
});
