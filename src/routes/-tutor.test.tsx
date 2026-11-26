import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { afterEach, expect, it, vi } from "vitest";
import type { Session } from "@supabase/supabase-js";
import { getAppState, resetAppState } from "@/lib/store";

const fixture = vi.hoisted(() => ({
  ask: vi.fn(),
  start: vi.fn(),
  mute: vi.fn(),
  finish: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: (listener: (event: string, session: Partial<Session>) => void) => {
        listener("SIGNED_IN", {
          access_token: "fixture",
          user: { id: "learner" } as Session["user"],
        });
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
    },
  },
}));
vi.mock("@/lib/tutor-written.functions", () => ({ askWrittenTutor: fixture.ask }));
vi.mock("@/lib/cloud-sync", () => ({ ownsLocalProgress: () => true }));
vi.mock("@/lib/tutor-call", () => ({
  TutorCall: class {
    constructor(
      readonly settings: { topic: string; level: string },
      readonly audio: HTMLAudioElement,
      readonly callbacks: {
        phase: (value: string) => void;
        caption: (text: string) => void;
        save: (id: string, record: unknown) => void;
        ended: (msg: string) => void;
      },
    ) {}
    assignment?: { title: string; text: string } | undefined;
    start(
      token: () => Promise<string>,
      previous: string,
      assignment?: { title: string; text: string },
    ) {
      this.assignment = assignment;
      fixture.start(token, previous, assignment);
      this.callbacks.phase("active");
      this.callbacks.caption("Mira: Hi, Yuri!");
    }
    mute(value: boolean) {
      fixture.mute(value);
    }
    finish() {
      fixture.finish();
      this.callbacks.save(crypto.randomUUID(), {
        ...this.settings,
        startedAt: 80,
        seconds: 13,
        summary: "Разобрали дорогу к отелю.",
        homework: "Спросить дорогу.",
        homeworkDone: false,
        ...(this.assignment && { resumeFrom: "Потренировать “" + this.assignment.text + "”" }),
      });
      this.callbacks.ended("");
    }
    close() {}
  },
}));
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: { component: ComponentType }) => ({
    options,
    useSearch: () => ({ tutor: { topic: "Работа", level: "B2" } }),
  }),
  Link: ({ to, children }: { to: string; children: ReactNode }) => <a href={to}>{children}</a>,
}));
import { Route } from "./tutor";
const Page = Route.options.component as ComponentType;
afterEach(() => {
  cleanup();
  resetAppState();
  vi.clearAllMocks();
});
it("saves an assignment at the end of the call and brings the completed task into the next call", async () => {
  render(<Page />);
  fireEvent.change(screen.getByLabelText("Тема"), { target: { value: "Путешествие" } });
  await act(async () =>
    fireEvent.click(await screen.findByRole("button", { name: "Начать звонок" })),
  );
  expect(screen.getByText("Mira: Hi, Yuri!")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Выключить микрофон" }));
  expect(fixture.mute).toHaveBeenCalledWith(true);
  fireEvent.click(screen.getByRole("button", { name: "Завершить звонок" }));
  fireEvent.click(screen.getByRole("checkbox", { name: /Спросить дорогу/ }));
  expect(Object.values(getAppState().tutorLessons ?? {})).toMatchObject([
    { topic: "Путешествие", homeworkDone: true },
  ]);
  cleanup();
  render(<Page />);
  expect(screen.getByRole("checkbox")).toBeChecked();
  fireEvent.click(screen.getByRole("button", { name: "Начать звонок" }));
  expect(fixture.start).toHaveBeenLastCalledWith(
    expect.any(Function),
    expect.stringContaining("Выполнено: Спросить дорогу."),
    undefined,
  );
});

it("keeps lesson settings while offline and enables calling when connectivity returns", async () => {
  const network = vi.spyOn(window.navigator, "onLine", "get").mockReturnValue(false);
  try {
    render(<Page />);
    expect(screen.getByRole("status")).toHaveTextContent("Для звонка нужен интернет");
    expect(screen.queryByRole("button", { name: "Начать звонок" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Мои занятия" })).toBeVisible();
    network.mockReturnValue(true);
    act(() => {
      window.dispatchEvent(new Event("online"));
    });
    expect(await screen.findByRole("button", { name: "Начать звонок" })).toBeEnabled();
    expect(screen.getByLabelText("Тема")).toHaveValue("Работа");
    expect(screen.getByLabelText("Уровень")).toHaveValue("B2");
    expect(fixture.start).not.toHaveBeenCalled();
  } finally {
    network.mockRestore();
  }
});

it("saves teacher homework separately and resumes only the selected exercise", async () => {
  render(<Page />);
  async function add(title: string, text: string) {
    fireEvent.click(await screen.findByRole("button", { name: "Добавить задание" }));
    fireEvent.change(screen.getByLabelText("Название задания"), { target: { value: title } });
    fireEvent.change(screen.getByLabelText("Текст для разбора"), { target: { value: text } });
    fireEvent.click(screen.getByRole("button", { name: "Сохранить задание" }));
  }
  await add("Lesson 3", "Ask for a room.");
  const [id] = Object.keys(getAppState().teacherAssignments!);
  fireEvent.click(screen.getByRole("button", { name: "Разобрать с Mira" }));
  expect(fixture.start).toHaveBeenLastCalledWith(expect.any(Function), "", {
    title: "Lesson 3",
    text: "Ask for a room.",
  });
  fireEvent.click(screen.getByRole("button", { name: "Завершить звонок" }));
  expect(getAppState().teacherAssignments![id!]!.done).toBe(false);
  expect(screen.getByText("Потренировать “Ask for a room.”")).toBeVisible();
  expect(screen.getByRole("heading", { name: "Lesson 3" })).toBeVisible();
  fireEvent.click(screen.getByRole("checkbox", { name: "Задание выполнено" }));
  await add("Lesson 4", "Order a coffee.");
  fireEvent.click(screen.getByRole("button", { name: "Разобрать с Mira" }));
  expect(fixture.start).toHaveBeenLastCalledWith(expect.any(Function), "", {
    title: "Lesson 4",
    text: "Order a coffee.",
  });
  fireEvent.click(screen.getByRole("button", { name: "Завершить звонок" }));
  cleanup();
  render(<Page />);
  expect(screen.queryByRole("button", { name: "Вернуться к заданию «Lesson 3»" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Вернуться к заданию «Lesson 4»" }));
  expect(screen.getByText("Потренировать “Order a coffee.”")).toBeVisible();
  fireEvent.change(screen.getByLabelText("Материал занятия"), { target: { value: id } });
  expect(screen.getByRole("checkbox", { name: "Задание выполнено" })).toBeChecked();
  fireEvent.click(screen.getByRole("button", { name: "Разобрать с Mira" }));
  expect(fixture.start).toHaveBeenLastCalledWith(
    expect.any(Function),
    expect.stringContaining("дорогу к отелю"),
    { title: "Lesson 3", text: "Ask for a room.", resumeFrom: "Потренировать “Ask for a room.”" },
  );
});

it("keeps drafts per exercise offline and keeps the learner's work if a written reply fails", async () => {
  const network = vi.spyOn(window.navigator, "onLine", "get").mockReturnValue(false);
  try {
    render(<Page />);
    fireEvent.click(await screen.findByRole("button", { name: "Добавить задание" }));
    fireEvent.change(screen.getByLabelText("Название задания"), {
      target: { value: "At the station" },
    });
    const text = "Complete the questions.\n1. Where ___ the station?\n2. When ___ the train leave?";
    fireEvent.change(screen.getByLabelText("Текст для разбора"), { target: { value: text } });
    fireEvent.click(screen.getByRole("button", { name: "Сохранить задание" }));
    fireEvent.click(screen.getByRole("button", { name: "Разобрать письменно" }));
    const draft = () => screen.getByLabelText("Ваш ответ или вопрос по упражнению");
    fireEvent.change(draft(), { target: { value: "Where is the station?" } });
    fireEvent.click(screen.getByRole("button", { name: "Дальше" }));
    expect(draft()).toHaveValue("");
    fireEvent.change(draft(), { target: { value: "When do the train leave?" } });
    expect(fixture.ask).not.toHaveBeenCalled();
    network.mockReturnValue(true);
    act(() => window.dispatchEvent(new Event("online")));
    fixture.ask.mockResolvedValueOnce({ error: "Сервис Mira занят." });
    fireEvent.click(screen.getByRole("button", { name: "Отправить Mira" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Сервис Mira занят.");
    expect(draft()).toHaveValue("When do the train leave?");
    fixture.ask.mockResolvedValueOnce({ reply: "С train нужно does." });
    fireEvent.click(screen.getByRole("button", { name: "Отправить Mira" }));
    expect(await screen.findByText(/С train нужно does/)).toBeVisible();
    expect(fixture.ask.mock.lastCall?.[0].data).toMatchObject({
      assignment: { text },
      step: 1,
      history: [],
      question: "When do the train leave?",
    });
    fireEvent.click(screen.getByRole("button", { name: "Назад" }));
    expect(draft()).toHaveValue("Where is the station?");
    expect(screen.queryByText(/С train нужно does/)).toBeNull();
    cleanup();
    render(<Page />);
    const [id] = Object.keys(getAppState().teacherAssignments!);
    fireEvent.change(screen.getByLabelText("Материал занятия"), { target: { value: id } });
    fireEvent.click(screen.getByRole("button", { name: "Разобрать письменно" }));
    expect(draft()).toHaveValue("Where is the station?");
    fireEvent.click(screen.getByRole("button", { name: "Дальше" }));
    expect(screen.getByText(/С train нужно does/)).toBeVisible();
  } finally {
    network.mockRestore();
  }
});
