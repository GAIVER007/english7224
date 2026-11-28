import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  AuthenticationError,
  OperationFailedError,
  PaymentRequiredError,
  RateLimitError,
  connectLive,
  generateResponse,
} from "@lovable.dev/ai-gateway";
import type { Message, Peer } from "crossws";
import { tutorHooks } from "./tutor-relay.server";

vi.mock("@lovable.dev/ai-gateway", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@lovable.dev/ai-gateway")>()),
  connectLive: vi.fn(),
  generateResponse: vi.fn(),
}));
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ auth: { getUser: async () => ({ data: { user: { id: "learner" } } }) } }),
}));

function start(assignment?: { title: string; text: string }) {
  const send = vi.fn();
  const peer = { send, close: vi.fn(), request: {} } as unknown as Peer;
  tutorHooks.open(peer);
  const message = {
    text: () =>
      JSON.stringify({
        type: "start",
        token: "learner-token",
        previous: "",
        sdp: "fixture",
        topic: "Работа",
        level: "A2",
        assignment,
      }),
  } as Message;
  return { peer, send, run: tutorHooks.message(peer, message) };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubEnv("LOVABLE_API_KEY", "test-key");
  vi.stubEnv("SUPABASE_URL", "https://example.invalid");
  vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "test-public-key");
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.mocked(connectLive).mockReset();
  vi.mocked(generateResponse).mockReset();
});

it("retries one refused upgrade and preserves a specific final refusal", async () => {
  vi.mocked(connectLive)
    .mockRejectedValueOnce(new OperationFailedError("First attempt", { httpStatus: 503 }))
    .mockRejectedValueOnce(
      new PaymentRequiredError("Sensitive provider text", { httpStatus: 402 }),
    );
  const { run, send } = start();
  await vi.runAllTimersAsync();
  await run;
  expect(connectLive).toHaveBeenCalledTimes(2);
  expect(vi.mocked(connectLive).mock.calls[0]).toEqual(vi.mocked(connectLive).mock.calls[1]);
  const reply = JSON.parse(send.mock.calls[0]![0]);
  expect(reply.message).toMatch(/оплат.*Код обращения/);
  expect(reply.message).not.toContain("Sensitive");
});

it.each([
  [new AuthenticationError("no access", { httpStatus: 401 }), "ключ"],
  [new RateLimitError("busy", { httpStatus: 429, retryAfter: 7000 }), "через 7 с"],
  [
    new OperationFailedError("The Live gateway rejected session creation.", {
      remote: { code: "insufficient_quota" },
    }),
    "квоту",
  ],
  [
    new OperationFailedError("The Live gateway rejected session creation.", {
      remote: { type: "server_error" },
    }),
    "голосовое сообщение",
  ],
  [new OperationFailedError("creation outcome unknown", {}), "не смог начать звонок"],
] as const)("does not replay a blocked or ambiguous session", async (error, expected) => {
  vi.mocked(connectLive).mockRejectedValue(error);
  const { run, send } = start();
  await run;
  expect(connectLive).toHaveBeenCalledTimes(1);
  expect(JSON.parse(send.mock.calls[0]![0]).message).toContain(expected);
});

it("cancels the scheduled retry when the learner leaves", async () => {
  vi.mocked(connectLive).mockRejectedValue(
    new RateLimitError("busy", { httpStatus: 429, retryAfter: 1200 }),
  );
  const { run, peer, send } = start();
  await vi.advanceTimersByTimeAsync(1);
  await tutorHooks.close(peer);
  await vi.runAllTimersAsync();
  await run;
  expect(connectLive).toHaveBeenCalledTimes(1);
  expect(send).not.toHaveBeenCalled();
});

it.each([
  { code: "unsupported_voice" },
  { type: "invalid_request_error", param: "session.audio.output.voice", code: "invalid_value" },
])("opens the same lesson using the default voice after an explicit rejection", async (remote) => {
  const failure = new OperationFailedError("The Live gateway rejected session creation.", {
    remote,
  });
  vi.mocked(connectLive)
    .mockRejectedValueOnce(failure)
    .mockResolvedValueOnce({
      created: { session: { id: "accepted" }, transport: { sdp: "accepted-answer" } },
      async *[Symbol.asyncIterator]() {
        yield { type: "session.closed", usage: { seconds: 0 } };
      },
    } as unknown as Awaited<ReturnType<typeof connectLive>>);
  const { run, send } = start({ title: "At the station", text: "Ask for a ticket." });
  await run;
  const [first, next] = vi.mocked(connectLive).mock.calls;
  expect(connectLive).toHaveBeenCalledTimes(2);
  const { audio, ...session } = first![0].session;
  expect(audio?.output?.voice).toBe("coral");
  expect(next).toEqual([{ ...first![0], session }, first![1]]);
  expect(send.mock.calls.map(([raw]) => JSON.parse(raw))).toContainEqual({
    type: "answer",
    sdp: "accepted-answer",
  });
});

it.each([
  [
    { code: "insufficient_quota", type: "invalid_request_error", param: "voice" },
    "insufficient_quota",
    false,
  ],
  [{ code: "rate_limit_exceeded" }, "rate_limit_exceeded", false],
  [{ code: "invalid_value", param: "transport.sdp" }, "transport.sdp", true],
  [{ code: "provider_error", type: "server_error" }, "provider_error", true],
  [
    { type: "invalid_request_error", code: "private_word", param: "private_word" },
    "invalid_request_error",
    true,
  ],
] as const)(
  "shows safe refusal details and does not replay unrelated failures",
  async (remote, detail, startMessages) => {
    vi.mocked(connectLive).mockRejectedValue(
      new OperationFailedError("The Live gateway rejected session creation.", { remote }),
    );
    const { run, send } = start();
    await run;
    const reply = JSON.parse(send.mock.calls[0]![0]);
    expect(connectLive).toHaveBeenCalledTimes(1);
    expect(reply.message).toContain(detail);
    expect(reply.startMessages === true).toBe(startMessages);
    expect(reply.message).toContain("Код обращения operation_failed/");
    expect(reply.message).not.toContain("private_word");
  },
);

it("does not attempt a third session if the corrected request also fails", async () => {
  vi.mocked(connectLive).mockRejectedValue(
    new OperationFailedError("The Live gateway rejected session creation.", {
      remote: { code: "invalid_voice" },
    }),
  );
  const { run, send } = start();
  await run;
  expect(connectLive).toHaveBeenCalledTimes(2);
  expect(JSON.parse(send.mock.calls[0]![0]).message).toContain("invalid_voice");
});

it.each(["unavailable", "empty"])(
  "continues speaking when the auxiliary coach is %s",
  async (reason) => {
    let delivered!: () => void;
    const guidanceSent = new Promise<void>((resolve) => {
      delivered = resolve;
    });
    const send = vi.fn(async () => delivered());
    vi.mocked(connectLive).mockResolvedValue({
      created: { session: { id: "voice-session" }, transport: { sdp: "answer" } },
      send,
      async *[Symbol.asyncIterator]() {
        yield { type: "session.delegation.created", delegation: { id: "turn-1" } };
        await guidanceSent;
      },
    } as unknown as Awaited<ReturnType<typeof connectLive>>);
    if (reason === "empty") {
      vi.mocked(generateResponse).mockResolvedValue({ output: [] } as unknown as Awaited<
        ReturnType<typeof generateResponse>
      >);
    } else {
      vi.mocked(generateResponse).mockRejectedValue(new OperationFailedError("unavailable"));
    }
    const { run, peer } = start();
    await run;
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "session.instructions.append",
        delegation_id: "turn-1",
        content: expect.stringContaining("Continue the conversation"),
      }),
    );
    expect(peer.close).toHaveBeenCalledWith(1000);
  },
);

it.each(["top-level", "nested", "unrelated", "fatal"] as const)(
  "only keeps the call open for a rejected coaching command (%s)",
  async (kind) => {
    let capture!: (command: { event_id?: string }) => void;
    const sent = new Promise<{ event_id?: string }>((resolve) => {
      capture = resolve;
    });
    vi.mocked(generateResponse).mockResolvedValue({ output: [] } as unknown as Awaited<
      ReturnType<typeof generateResponse>
    >);
    vi.mocked(connectLive).mockResolvedValue({
      created: { session: { id: "session" }, transport: { sdp: "answer" } },
      send: vi.fn(async (command) => capture(command)),
      async *[Symbol.asyncIterator]() {
        yield { type: "session.delegation.created", delegation: { id: "turn" } };
        const { event_id } = await sent;
        const id = kind === "unrelated" ? "other-command" : event_id;
        yield {
          type: "error",
          ...(kind !== "nested" && { client_event_id: id }),
          error: {
            type: kind === "fatal" ? "server_error" : "invalid_request_error",
            ...(kind === "nested" && { client_event_id: id }),
          },
        };
        yield { type: "session.output_transcript.delta", delta: "Where is the station?" };
      },
    } as unknown as Awaited<ReturnType<typeof connectLive>>);
    const { peer, send, run } = start({ title: "Travelling", text: "Ask for a ticket." });
    await run;
    expect((await sent).event_id).toEqual(expect.any(String));
    const events = send.mock.calls.map(([raw]) => JSON.parse(raw));
    if (kind === "unrelated" || kind === "fatal") {
      expect(peer.close).toHaveBeenCalledWith(1011);
      expect(events.at(-1)).toMatchObject({ type: "error" });
    } else {
      expect(peer.close).toHaveBeenCalledWith(1000);
      expect(events.at(-1)).toEqual({
        type: "caption",
        who: "Mira",
        delta: "Where is the station?",
      });
    }
    expect(connectLive).toHaveBeenCalledTimes(1);
  },
);
