import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { CoachBridge } from "./CoachBridge";
import { createInitialState } from "@/lib/store";

it("copies the selected practice without sending any request", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
  render(<CoachBridge state={createInitialState()} />);
  fireEvent.click(screen.getByText("Практика с ChatGPT"));
  fireEvent.click(screen.getByLabelText("Разбор ошибок"));
  fireEvent.click(screen.getByRole("button", { name: "Скопировать" }));
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Скопировано"));
  expect(writeText).toHaveBeenCalledWith(
    expect.stringContaining("Не выдумывай мои прошлые ошибки"),
  );
});
it("keeps the prompt available when clipboard access fails", async () => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) },
  });
  render(<CoachBridge state={createInitialState()} />);
  fireEvent.click(screen.getByText("Практика с ChatGPT"));
  fireEvent.click(screen.getByRole("button", { name: "Скопировать" }));
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("скопируй вручную"));
  expect((screen.getByLabelText("Текст для отправки") as HTMLTextAreaElement).value).toContain(
    "Ты мой персональный наставник",
  );
});
