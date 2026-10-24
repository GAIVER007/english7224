import { describe, expect, it, vi } from "vitest";
import {
  OfflineTranslatorError,
  chunkTranslationText,
  createOfflineTranslatorClient,
  type OfflineWorkerLike,
  type OfflineWorkerRequest,
  type OfflineWorkerResponse,
} from "./offline-translator";
import { isCompletePinnedModelManifest } from "./offline-translator.shared";

class FakeWorker implements OfflineWorkerLike {
  readonly sent: OfflineWorkerRequest[] = [];
  private messageListener?: (event: { data: OfflineWorkerResponse }) => void;
  private errorListener?: () => void;

  postMessage(message: OfflineWorkerRequest) {
    this.sent.push(message);
  }

  addEventListener(
    type: "message" | "error",
    listener: ((event: { data: OfflineWorkerResponse }) => void) | (() => void),
  ) {
    if (type === "message")
      this.messageListener = listener as (event: { data: OfflineWorkerResponse }) => void;
    else this.errorListener = listener as () => void;
  }

  respond(response: OfflineWorkerResponse) {
    this.messageListener?.({ data: response });
  }
}

describe("chunkTranslationText", () => {
  it("keeps every sentence in a separate Marian request", () => {
    const chunks = chunkTranslationText(
      "Я хочу изучать английский каждый день. Где находится ближайшая станция метро?",
    );

    expect(chunks).toEqual([
      { text: "Я хочу изучать английский каждый день.", separator: " " },
      { text: "Где находится ближайшая станция метро?", separator: "" },
    ]);
  });

  it("splits long prose at natural boundaries and preserves paragraph breaks", () => {
    const text = `${"Первое предложение короткое. ".repeat(5)}\n\n${"Second paragraph has several words. ".repeat(5)}`;
    const chunks = chunkTranslationText(text, 80);

    expect(chunks.length).toBeGreaterThan(2);
    expect(chunks.every((chunk) => chunk.text.length <= 80)).toBe(true);
    expect(chunks.map((chunk) => chunk.separator).join("")).toContain("\n\n");
  });

  it("rejects an unbroken fragment that cannot fit the model", () => {
    expect(() => chunkTranslationText("а".repeat(81), 80)).toThrowError(OfflineTranslatorError);
  });
});

describe("offline model manifest", () => {
  const model = { id: "onnx-community/opus-mt-ru-en", revision: "pinned-revision" };
  const prefix = `https://huggingface.co/${model.id}/resolve/${model.revision}`;
  const complete = [
    `${prefix}/config.json`,
    `${prefix}/tokenizer.json`,
    `${prefix}/onnx/encoder_model_quantized.onnx`,
    `${prefix}/onnx/decoder_model_merged_quantized.onnx`,
  ];

  it("accepts only a complete manifest from the pinned model revision", () => {
    expect(isCompletePinnedModelManifest(complete, model)).toBe(true);
    expect(
      isCompletePinnedModelManifest(
        complete.map((file) => file.replace("pinned-revision", "older-revision")),
        model,
      ),
    ).toBe(false);
  });

  it("rejects manifests with missing model assets or a different repository", () => {
    expect(isCompletePinnedModelManifest(complete.slice(0, 3), model)).toBe(false);
    expect(
      isCompletePinnedModelManifest(
        complete.map((file) => file.replace(model.id, "someone/other-model")),
        model,
      ),
    ).toBe(false);
  });
});

describe("offline translator client", () => {
  it("forwards installation progress and shares one active installation", async () => {
    const worker = new FakeWorker();
    const client = createOfflineTranslatorClient(() => worker);
    const firstProgress = vi.fn();
    const secondProgress = vi.fn();
    const first = client.prepare(firstProgress);
    const second = client.prepare(secondProgress);
    const install = worker.sent[0];
    expect(install?.type).toBe("install");
    if (!install || install.type !== "install") throw new Error("install request missing");

    worker.respond({
      type: "progress",
      id: install.id,
      progress: { phase: "downloading", source: "ru", progress: 42, file: "encoder.onnx" },
    });
    worker.respond({ type: "result", id: install.id, value: null });

    await expect(Promise.all([first, second])).resolves.toEqual([undefined, undefined]);
    expect(worker.sent).toHaveLength(1);
    expect(firstProgress).toHaveBeenCalledOnce();
    expect(secondProgress).toHaveBeenCalledOnce();
  });

  it("cancels a request and ignores its late worker result", async () => {
    const worker = new FakeWorker();
    const client = createOfflineTranslatorClient(() => worker);
    const controller = new AbortController();
    const translation = client.translate("Привет", "ru", controller.signal);
    const translate = worker.sent[0];
    if (!translate || translate.type !== "translate") throw new Error("translate request missing");

    controller.abort();
    worker.respond({ type: "result", id: translate.id, value: "Hello" });

    await expect(translation).rejects.toMatchObject({ code: "aborted" });
    expect(worker.sent.at(-1)).toEqual({ type: "cancel", id: translate.id });
  });

  it("reports persistent installation status", async () => {
    const worker = new FakeWorker();
    const client = createOfflineTranslatorClient(() => worker);
    const status = client.status();
    const request = worker.sent[0];
    if (!request || request.type !== "status") throw new Error("status request missing");
    worker.respond({ type: "result", id: request.id, value: true });
    await expect(status).resolves.toBe(true);
  });
});
