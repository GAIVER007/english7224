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

function start() {
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
    expect(send).toHaveBeenCalledWith({
      type: "session.instructions.append",
      delegation_id: "turn-1",
      content: expect.stringContaining("Continue the conversation"),
    });
    expect(peer.close).toHaveBeenCalledWith(1000);
  },
);
