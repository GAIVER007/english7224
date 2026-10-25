import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SyncConflictPanel } from "./SyncConflictPanel";
import { createInitialState } from "@/lib/store";
import { emptyPath, emptyUnit } from "@/lib/pathway/state";

afterEach(cleanup);
function copies() {
  const local = createInitialState();
  local.pathway = {
    ...emptyPath(),
    units: {
      "a0-01": { ...emptyUnit(), writing: "My local answer", speakingNotes: "Меньше пауз" },
    },
  };
  const cloud = createInitialState();
  cloud.pathway = {
    ...emptyPath(),
    units: { "a0-01": { ...emptyUnit(), writing: "My cloud answer" } },
  };
  return { local, cloud };
}
describe("sync conflict choices", () => {
  it("shows both drafts without choosing automatically and applies only an explicit choice", async () => {
    const resolve = vi.fn().mockResolvedValue(undefined);
    render(<SyncConflictPanel conflict={copies()} onResolve={resolve} />);
    expect(screen.getByText("My local answer")).toBeTruthy();
    expect(screen.getByText("My cloud answer")).toBeTruthy();
    expect(resolve).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole("button", { name: "Использовать спорные изменения: в аккаунте" }),
    );
    await waitFor(() => expect(resolve).toHaveBeenCalledWith("cloud"));
  });
  it("explains whole-copy transfer when the device belongs to another account", () => {
    render(
      <SyncConflictPanel
        conflict={{ ...copies(), reason: "account-change" }}
        onResolve={vi.fn()}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("прогресс другого аккаунта");
    expect(screen.getByRole("button", { name: "Загрузить прогресс этого аккаунта" })).toBeTruthy();
  });
  it("keeps the two copies available after a failed resolution", async () => {
    const resolve = vi.fn().mockRejectedValue(new Error("offline"));
    render(<SyncConflictPanel conflict={copies()} onResolve={resolve} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Использовать спорные изменения: на этом устройстве" }),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent("Не удалось объединить");
    expect(screen.getAllByRole("button", { name: /Скачать копию/ })).toHaveLength(2);
  });
});
