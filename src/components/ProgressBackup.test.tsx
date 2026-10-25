import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ProgressBackup } from "./ProgressBackup";
import { createBackup, MAX_BACKUP_BYTES } from "@/lib/backup";
import { createInitialState, restoreAppState } from "@/lib/store";

vi.mock("@/lib/store", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/store")>();
  return {
    ...actual,
    restoreAppState: vi.fn(),
    useAppState: () => ({ state: { ...actual.createInitialState(), xp: 60 } }),
  };
});
beforeEach(() => {
  vi.mocked(restoreAppState).mockReset();
});
afterEach(cleanup);

function choose(text: string) {
  fireEvent.change(screen.getByLabelText("Файл резервной копии"), {
    target: { files: [{ size: text.length, text: async () => text }] },
  });
}
it("previews a validated backup and only restores after an explicit choice", async () => {
  render(<ProgressBackup />);
  choose(createBackup({ ...createInitialState(), xp: 120, day: 3 }));
  await screen.findByRole("region", { name: "Предпросмотр копии" });
  expect(restoreAppState).not.toHaveBeenCalled();
  expect(screen.getByText(/120 XP/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Заменить прогресс этой копией" }));
  expect(restoreAppState).toHaveBeenCalledWith(expect.objectContaining({ xp: 120, day: 3 }));
  expect(screen.getByRole("status")).toHaveTextContent("Прогресс восстановлен");
});
it("rejects invalid files and allows cancellation without altering progress", async () => {
  render(<ProgressBackup />);
  choose("not json");
  await screen.findByRole("alert");
  expect(screen.queryByRole("region", { name: "Предпросмотр копии" })).not.toBeInTheDocument();
  choose(createBackup(createInitialState()));
  await screen.findByRole("region", { name: "Предпросмотр копии" });
  fireEvent.click(screen.getByRole("button", { name: "Отмена" }));
  expect(restoreAppState).not.toHaveBeenCalled();
});
it("rejects files larger than 20 MB before reading them", async () => {
  const read = vi.fn(async () => "not read");
  render(<ProgressBackup />);
  fireEvent.change(screen.getByLabelText("Файл резервной копии"), {
    target: { files: [{ size: MAX_BACKUP_BYTES + 1, text: read }] },
  });

  expect(await screen.findByRole("alert")).toHaveTextContent("до 20 МБ");
  expect(read).not.toHaveBeenCalled();
});
it("keeps the preview available if persistence fails and reports no success", async () => {
  vi.mocked(restoreAppState).mockImplementation(() => {
    throw new Error("Не удалось сохранить копию");
  });
  render(<ProgressBackup />);
  choose(createBackup(createInitialState()));
  await screen.findByRole("region", { name: "Предпросмотр копии" });
  fireEvent.click(screen.getByRole("button", { name: "Заменить прогресс этой копией" }));
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Не удалось сохранить"));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(screen.getByRole("region", { name: "Предпросмотр копии" })).toBeInTheDocument();
});
