import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DictationPractice } from "./DictationPractice";
import type { PathUnitProgress } from "@/lib/pathway/state";
vi.mock("@/lib/store", () => ({ speak: vi.fn() }));
afterEach(cleanup);
function Practice() {
  const [saved, onChange] = useState<PathUnitProgress["dictation"]>([]);
  return (
    <>
      <DictationPractice
        text="We are at home. They work every day."
        saved={saved}
        onChange={onChange}
      />
      <output data-testid="saved">{JSON.stringify(saved)}</output>
    </>
  );
}
function open() {
  fireEvent.click(screen.getByText("Диктант на слух"));
}
describe("dictation practice", () => {
  it("preserves each phrase draft and explains a missing word", () => {
    render(<Practice />);
    open();
    fireEvent.change(screen.getByLabelText("Что ты услышал?"), { target: { value: "We at home" } });
    fireEvent.click(screen.getByRole("button", { name: "Фраза 2" }));
    expect(screen.getByLabelText("Что ты услышал?")).toHaveValue("");
    fireEvent.click(screen.getByRole("button", { name: "Фраза 1" }));
    expect(screen.getByLabelText("Что ты услышал?")).toHaveValue("We at home");
    fireEvent.click(screen.getByRole("button", { name: "Проверить фразу" }));
    expect(screen.getByText("Пропущено: are")).toBeInTheDocument();
  });
  it("does not count a copied answer until an unassisted retry", () => {
    render(<Practice />);
    open();
    fireEvent.click(screen.getByRole("button", { name: "Показать ответ" }));
    fireEvent.change(screen.getByLabelText("Что ты услышал?"), {
      target: { value: "We are at home" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Проверить фразу" }));
    expect(JSON.parse(screen.getByTestId("saved").textContent!)[0].completed).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Повторить без подсказки" }));
    expect(screen.queryByText("We are at home.")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Что ты услышал?"), {
      target: { value: "We are at home!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Проверить фразу" }));
    expect(JSON.parse(screen.getByTestId("saved").textContent!)[0].completed).toBe(true);
  });
});
