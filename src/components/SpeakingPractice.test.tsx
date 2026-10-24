import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SpeakingPractice } from "@/components/SpeakingPractice";
import { compareSpeechText, type SpeechRecognitionLike } from "@/lib/speech";

class MockRecognition implements SpeechRecognitionLike {
  static instances: MockRecognition[] = [];

  lang = "";
  continuous = true;
  interimResults = true;
  maxAlternatives = 0;
  onresult: SpeechRecognitionLike["onresult"] = null;
  onerror: SpeechRecognitionLike["onerror"] = null;
  onend: SpeechRecognitionLike["onend"] = null;
  start = vi.fn();
  abort = vi.fn();

  constructor() {
    MockRecognition.instances.push(this);
  }
}

const items = [{ prompt: "Спросите дорогу", target: "Could you tell me where the station is" }];

function setRecognition(value?: typeof MockRecognition) {
  Object.defineProperty(window, "SpeechRecognition", { configurable: true, writable: true, value });
  Object.defineProperty(window, "webkitSpeechRecognition", {
    configurable: true,
    writable: true,
    value: undefined,
  });
}

afterEach(() => {
  MockRecognition.instances = [];
  setRecognition(undefined);
  vi.restoreAllMocks();
});

describe("SpeakingPractice", () => {
  it("always offers a manual path when recognition is unsupported", () => {
    setRecognition(undefined);
    const onDone = vi.fn();
    render(<SpeakingPractice items={items} onDone={onDone} />);

    expect(screen.getByRole("status")).toHaveTextContent("Распознавание речи недоступно");
    expect(screen.getByRole("button", { name: `Прослушать: ${items[0]!.target}` })).toBeDisabled();
    const finish = screen.getByRole("button", { name: "Завершить" });
    expect(finish).toBeDisabled();

    fireEvent.click(screen.getByRole("checkbox", { name: "Я произнёс фразу самостоятельно" }));
    fireEvent.click(finish);

    expect(onDone).toHaveBeenCalledOnce();
  });

  it("reports recognition errors and aborts active recognition on retry and unmount", () => {
    setRecognition(MockRecognition);
    const view = render(<SpeakingPractice items={items} onDone={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "🎤 Начать запись" }));
    const first = MockRecognition.instances[0]!;
    expect(first.start).toHaveBeenCalledOnce();

    act(() => first.onerror?.({ error: "network" }));
    expect(screen.getByRole("alert")).toHaveTextContent("сервисом распознавания");

    fireEvent.click(screen.getByRole("button", { name: "🎤 Попробовать ещё раз" }));
    expect(first.abort).toHaveBeenCalledOnce();
    const second = MockRecognition.instances[1]!;
    expect(second.start).toHaveBeenCalledOnce();

    view.unmount();
    expect(second.abort).toHaveBeenCalledOnce();
  });

  it("aborts recognition before advancing", () => {
    setRecognition(MockRecognition);
    const onDone = vi.fn();
    render(<SpeakingPractice items={items} onDone={onDone} />);

    fireEvent.click(screen.getByRole("button", { name: "🎤 Начать запись" }));
    const recognition = MockRecognition.instances[0]!;
    act(() =>
      recognition.onresult?.({
        results: [[{ transcript: "Could you tell me where the station is" }]],
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Завершить" }));

    expect(recognition.abort).toHaveBeenCalledOnce();
    expect(onDone).toHaveBeenCalledOnce();
  });

  it("does not accept hearing only the final two words of a longer phrase", () => {
    const result = compareSpeechText("station is", "Could you tell me where the station is");

    expect(result.matches).toBe(false);
    expect(result.coverage).toBeLessThan(0.7);
  });
});
