import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { OfflineModels } from "./OfflineModels";
import { getOfflineModelStatus, prepareOfflineModels } from "@/lib/offline-translator";
vi.mock("@/lib/offline-translator", () => ({
  getOfflineModelStatus: vi.fn(),
  prepareOfflineModels: vi.fn(),
}));
beforeEach(() => {
  vi.mocked(getOfflineModelStatus).mockReset();
  vi.mocked(prepareOfflineModels).mockReset();
});
afterEach(cleanup);
it("does not download until asked and checks persisted files before announcing readiness", async () => {
  const onReady = vi.fn();
  vi.mocked(getOfflineModelStatus).mockResolvedValueOnce(false).mockResolvedValueOnce(true);
  vi.mocked(prepareOfflineModels).mockResolvedValue();
  render(<OfflineModels onReady={onReady} />);
  const install = await screen.findByRole("button", { name: "Скачать языковые пакеты" });
  expect(prepareOfflineModels).not.toHaveBeenCalled();
  fireEvent.click(install);
  await screen.findByRole("heading", { name: "Языковые пакеты сохранены" });
  expect(onReady).toHaveBeenLastCalledWith(true);
});
it("shows download failures without claiming offline readiness", async () => {
  const onReady = vi.fn();
  vi.mocked(getOfflineModelStatus).mockResolvedValue(false);
  vi.mocked(prepareOfflineModels).mockRejectedValue(new Error("Недостаточно места"));
  render(<OfflineModels onReady={onReady} />);
  fireEvent.click(await screen.findByRole("button", { name: "Скачать языковые пакеты" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Недостаточно места");
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Скачать языковые пакеты" })).toBeEnabled(),
  );
  expect(onReady).not.toHaveBeenCalledWith(true);
});

it("does not mark incomplete persisted downloads as ready", async () => {
  const onReady = vi.fn();
  vi.mocked(getOfflineModelStatus).mockResolvedValue(false);
  vi.mocked(prepareOfflineModels).mockResolvedValue();
  render(<OfflineModels onReady={onReady} />);
  fireEvent.click(await screen.findByRole("button", { name: "Скачать языковые пакеты" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Не удалось сохранить все файлы");
  expect(onReady).not.toHaveBeenCalledWith(true);
});
