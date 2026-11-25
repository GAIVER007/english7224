import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { afterEach, expect, it, vi } from "vitest";
import type { Session } from "@supabase/supabase-js";
import { getAppState, resetAppState } from "@/lib/store";

const fixture = vi.hoisted(() => ({ start: vi.fn(), mute: vi.fn(), finish: vi.fn() }));
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
    start(token: string, previous: string) {
      fixture.start(token, previous);
      this.callbacks.phase("active");
      this.callbacks.caption("Mira: Hi, Yuri!");
    }
    mute(value: boolean) {
      fixture.mute(value);
    }
    finish() {
      fixture.finish();
      this.callbacks.save("803c09ee-0465-4874-81d2-bbc6c0aa15f3", {
        ...this.settings,
        startedAt: 80,
        seconds: 13,
        summary: "Разобрали дорогу к отелю.",
        homework: "Спросить дорогу.",
        homeworkDone: false,
      });
      this.callbacks.ended("");
    }
    close() {}
  },
}));
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: { component: ComponentType }) => ({ options }),
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
    "fixture",
    expect.stringContaining("Выполнено: Спросить дорогу."),
  );
});
