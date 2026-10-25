import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({
  getUser: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth } }));
vi.mock("@/lib/cloud-sync", () => ({
  getSyncStatus: () => "off",
  getSyncConflict: () => null,
  onSyncStatus: () => () => {},
  resolveSyncConflict: vi.fn(),
  retrySync: vi.fn(),
}));
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: { component: ComponentType }) => ({ options }),
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}));
import { Route } from "./account";
const Account = Route.options.component as ComponentType;
afterEach(cleanup);
beforeEach(() => vi.clearAllMocks());

describe("account network recovery", () => {
  it("shows a usable sign-in form after account lookup rejects", async () => {
    auth.getUser.mockRejectedValue(new Error("offline"));
    render(<Account />);
    expect(await screen.findByLabelText("Почта")).toBeTruthy();
    expect(screen.getByRole("alert")).toHaveTextContent("Локальные занятия доступны");
  });
  it("unlocks sign-in after a network failure", async () => {
    auth.getUser.mockResolvedValue({ data: { user: null } });
    auth.signInWithPassword.mockRejectedValue(new Error("offline"));
    render(<Account />);
    fireEvent.change(await screen.findByLabelText("Почта"), {
      target: { value: "learner@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), { target: { value: "test-password" } });
    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: "Войти" }).closest("form")!);
    });
    expect(screen.getByRole("alert")).toHaveTextContent("Нет связи");
    expect(screen.getByRole("button", { name: "Войти" })).not.toBeDisabled();
  });
});
