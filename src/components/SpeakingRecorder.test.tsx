import { StrictMode } from "react";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SpeakingRecorder } from "@/components/SpeakingRecorder";

class MockMediaRecorder {
  static instances: MockMediaRecorder[] = [];

  state: RecordingState = "inactive";
  mimeType = "audio/webm";
  ondataavailable: ((event: BlobEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onstop: ((event: Event) => void) | null = null;

  start = vi.fn(() => {
    this.state = "recording";
  });
  stop = vi.fn(() => {
    if (this.state === "inactive") return;
    this.state = "inactive";
    this.ondataavailable?.({ data: new Blob(["voice"]) } as BlobEvent);
    this.onstop?.(new Event("stop"));
  });

  constructor(_stream: MediaStream) {
    MockMediaRecorder.instances.push(this);
  }
}

function makeStream() {
  const stop = vi.fn();
  return {
    stream: { getTracks: () => [{ stop }] } as unknown as MediaStream,
    stop,
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

beforeEach(() => {
  MockMediaRecorder.instances = [];
  vi.stubGlobal("MediaRecorder", MockMediaRecorder);
  vi.stubGlobal("URL", {
    ...URL,
    createObjectURL: vi.fn(() => "blob:recording"),
    revokeObjectURL: vi.fn(),
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: undefined,
  });
});

describe("SpeakingRecorder", () => {
  it("requests microphone access only after the user clicks and explains denied permission", async () => {
    const getUserMedia = vi.fn().mockRejectedValue(new DOMException("denied", "NotAllowedError"));
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia },
    });
    render(<SpeakingRecorder model="I would like to practise speaking." />);

    expect(getUserMedia).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Начать запись" }));

    expect(getUserMedia).toHaveBeenCalledWith({ audio: true, video: false });
    expect(await screen.findByRole("alert")).toHaveTextContent("Доступ к микрофону запрещён");
  });

  it("records after React Strict Mode replays effects", async () => {
    const { stream } = makeStream();
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: vi.fn().mockResolvedValue(stream) },
    });
    render(
      <StrictMode>
        <SpeakingRecorder model="I would like to practise speaking." />
      </StrictMode>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Начать запись" }));

    expect(await screen.findByRole("button", { name: "Остановить запись" })).toBeInTheDocument();
  });

  it("stops the stream, creates local playback and reports one successful attempt", async () => {
    const { stream, stop } = makeStream();
    const onRecorded = vi.fn();
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: vi.fn().mockResolvedValue(stream) },
    });
    render(<SpeakingRecorder model="I would like to practise speaking." onRecorded={onRecorded} />);

    fireEvent.click(screen.getByRole("button", { name: "Начать запись" }));
    const stopButton = await screen.findByRole("button", { name: "Остановить запись" });
    fireEvent.click(stopButton);

    expect(stop).toHaveBeenCalledOnce();
    expect(await screen.findByLabelText("Воспроизвести мою запись")).toHaveAttribute(
      "src",
      "blob:recording",
    );
    expect(onRecorded).toHaveBeenCalledOnce();
    expect(onRecorded).toHaveBeenCalledWith(1);

    act(() => MockMediaRecorder.instances[0]!.onstop?.(new Event("stop")));
    expect(onRecorded).toHaveBeenCalledOnce();
  });

  it("keeps a voice message local until sent and allows a failed upload to be retried", async () => {
    const { stream } = makeStream();
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: vi.fn().mockResolvedValue(stream) },
    });
    const send = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    render(<SpeakingRecorder onSend={send} />);
    fireEvent.click(screen.getByRole("button", { name: "Начать запись" }));
    fireEvent.click(await screen.findByRole("button", { name: "Остановить запись" }));
    const upload = await screen.findByRole("button", { name: "Отправить запись Mira" });
    expect(send).not.toHaveBeenCalled();
    await act(async () => fireEvent.click(upload));
    expect(send).toHaveBeenCalledWith(expect.any(Blob));
    expect(screen.getByLabelText("Воспроизвести мою запись")).toBeVisible();
    await act(async () => fireEvent.click(upload));
    expect(send.mock.calls[0]![0]).toBe(send.mock.calls[1]![0]);
    expect(screen.queryByRole("button", { name: "Отправить запись Mira" })).toBeNull();
  });

  it("automatically stops at two minutes", async () => {
    vi.useFakeTimers();
    const { stream, stop } = makeStream();
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: vi.fn().mockResolvedValue(stream) },
    });
    render(<SpeakingRecorder model="A longer speaking answer." />);

    fireEvent.click(screen.getByRole("button", { name: "Начать запись" }));
    await act(async () => Promise.resolve());
    expect(screen.getByRole("button", { name: "Остановить запись" })).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(120_000));

    expect(MockMediaRecorder.instances[0]!.stop).toHaveBeenCalledOnce();
    expect(stop).toHaveBeenCalledOnce();
    expect(screen.getByText("Ваша попытка · 2:00")).toBeInTheDocument();
  });

  it("releases a late microphone stream when the component is already unmounted", async () => {
    const pending = deferred<MediaStream>();
    const { stream, stop } = makeStream();
    const onRecorded = vi.fn();
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: vi.fn(() => pending.promise) },
    });
    const view = render(
      <SpeakingRecorder model="I would like to practise speaking." onRecorded={onRecorded} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Начать запись" }));
    view.unmount();
    await act(async () => pending.resolve(stream));

    expect(stop).toHaveBeenCalledOnce();
    expect(MockMediaRecorder.instances).toHaveLength(0);
    expect(onRecorded).not.toHaveBeenCalled();
  });

  it("stops active recording and revokes temporary audio when leaving", async () => {
    const first = makeStream();
    const second = makeStream();
    const getUserMedia = vi
      .fn()
      .mockResolvedValueOnce(first.stream)
      .mockResolvedValueOnce(second.stream);
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia },
    });
    const view = render(<SpeakingRecorder model="I would like to practise speaking." />);

    fireEvent.click(screen.getByRole("button", { name: "Начать запись" }));
    fireEvent.click(await screen.findByRole("button", { name: "Остановить запись" }));
    fireEvent.click(screen.getByRole("button", { name: "Записать заново" }));

    await waitFor(() => expect(MockMediaRecorder.instances).toHaveLength(2));
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:recording");
    view.unmount();

    expect(MockMediaRecorder.instances[1]!.stop).toHaveBeenCalledOnce();
    expect(second.stop).toHaveBeenCalledOnce();
  });
});
