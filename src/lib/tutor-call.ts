import {
  relayEvent,
  tutorPath,
  missingTutorNotes,
  type CallAssignment,
  type TutorSettings,
  type TutorLesson,
} from "./tutor";

export type CallPhase = "idle" | "connecting" | "active" | "finishing";
interface CallCallbacks {
  phase: (phase: CallPhase) => void;
  caption: (text: string) => void;
  playbackBlocked: (blocked: boolean) => void;
  ended: (message: string) => void;
  save: (id: string, record: TutorLesson) => void;
}

export class TutorCall {
  private peer?: RTCPeerConnection;
  private mic?: MediaStream;
  private socket?: WebSocket;
  private channel?: RTCDataChannel;
  private phase: CallPhase = "connecting";
  private disposed = false;
  private startedAt = 0;
  private readonly id = crypto.randomUUID();
  private seconds = 0;
  private caption = "";
  private speaker = "";
  private usage = 0;
  private notes?: Pick<TutorLesson, "summary" | "homework" | "resumeFrom">;
  private pulse?: ReturnType<typeof setInterval>;
  private deadline?: ReturnType<typeof setTimeout>;
  constructor(
    private settings: TutorSettings,
    private audio: HTMLAudioElement,
    private callbacks: CallCallbacks,
  ) {}

  async start(getToken: () => Promise<string>, previous: string, assignment?: CallAssignment) {
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === "undefined")
        throw Error("Для звонка нужен браузер с поддержкой микрофона и WebRTC.");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true },
      });
      if (this.disposed) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      this.mic = stream;
      this.timeout(45000, "Не удалось установить связь с Mira.");
      const peer = new RTCPeerConnection();
      this.peer = peer;
      stream.getTracks().forEach((t) => peer.addTrack(t, stream));
      const channel = peer.createDataChannel("oai-events");
      this.channel = channel;
      channel.onopen = () => this.connected();
      channel.onclose = () => this.mediaLost();
      peer.ontrack = ({ track, streams }) => {
        this.audio.srcObject = streams[0] ?? new MediaStream([track]);
        void this.play();
      };
      peer.onconnectionstatechange = () => {
        if (peer.connectionState === "connected") this.connected();
        if (peer.connectionState === "failed" || peer.connectionState === "closed")
          this.mediaLost();
      };
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      // The relay exchanges one SDP offer and answer, without trickle ICE.
      if (peer.iceGatheringState !== "complete") {
        await new Promise<void>((resolve) => {
          const done = () => {
            clearTimeout(timer);
            peer.removeEventListener("icegatheringstatechange", changed);
            resolve();
          };
          const changed = () => {
            if (peer.iceGatheringState === "complete") done();
          };
          const timer = setTimeout(done, 2500);
          peer.addEventListener("icegatheringstatechange", changed);
        });
      }
      if (this.disposed) return;
      const token = await getToken();
      if (this.disposed) return;
      const url = new URL(tutorPath, location.href);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
      const socket = new WebSocket(url);
      this.socket = socket;
      socket.onopen = () =>
        socket.send(
          JSON.stringify({
            type: "start",
            ...this.settings,
            token,
            previous,
            assignment,
            sdp: peer.localDescription?.sdp,
          }),
        );
      socket.onmessage = (e) => {
        void this.receive(e.data).catch(() => this.close("Не удалось обработать ответ Mira."));
      };
      socket.onerror = () => this.close("Нет связи с сервером Mira.");
      socket.onclose = (e) => this.close(e.code === 1000 ? "" : "Связь с Mira прервалась.");
    } catch (error) {
      const denied = error instanceof DOMException && error.name === "NotAllowedError";
      this.close(
        denied
          ? "Разрешите доступ к микрофону в настройках браузера."
          : error instanceof Error
            ? error.message
            : "Не удалось начать звонок.",
      );
    }
  }

  private async receive(raw: string) {
    if (this.disposed) return;
    const event = relayEvent.parse(JSON.parse(raw));
    switch (event.type) {
      case "answer":
        try {
          // SDP is line-based. Some gateways omit the final CRLF that browsers require.
          const sdp = event.sdp.trimEnd().replace(/\r\n?|\n/g, "\r\n") + "\r\n";
          await this.peer!.setRemoteDescription({ type: "answer", sdp });
        } catch {
          this.close(
            "Браузеру не удалось согласовать звук с Mira. Попробуйте начать звонок ещё раз.",
          );
        }
        break;
      case "caption":
        this.caption = (
          (event.who === this.speaker ? this.caption : event.who + ": ") + event.delta
        ).slice(-1600);
        this.speaker = event.who;
        this.callbacks.caption(this.caption);
        break;
      case "usage":
        this.usage = Math.round(event.seconds);
        break;
      case "notes":
        this.notes = {
          summary: event.summary,
          homework: event.homework,
          ...(event.resumeFrom !== undefined && { resumeFrom: event.resumeFrom }),
        };
        break;
      case "error":
        this.close(event.message);
        break;
    }
  }

  private connected() {
    if (
      this.disposed ||
      this.phase !== "connecting" ||
      this.peer?.connectionState !== "connected" ||
      this.channel?.readyState !== "open"
    )
      return;
    clearTimeout(this.deadline);
    this.startedAt = Date.now();
    this.phase = "active";
    this.callbacks.phase("active");
    this.pulse = setInterval(() => {
      if (
        this.peer?.connectionState === "connected" &&
        this.channel?.readyState === "open" &&
        this.socket?.readyState === WebSocket.OPEN
      )
        this.socket.send(JSON.stringify({ type: "heartbeat" }));
    }, 10000);
  }

  private timeout(ms: number, message: string) {
    clearTimeout(this.deadline);
    this.deadline = setTimeout(() => this.close(message), ms);
  }

  private mediaLost() {
    if (!this.disposed && this.phase !== "finishing")
      this.close("Голосовое соединение прервалось.");
  }

  async play() {
    try {
      await this.audio.play();
      if (!this.disposed) this.callbacks.playbackBlocked(false);
    } catch {
      if (!this.disposed) this.callbacks.playbackBlocked(true);
    }
  }

  mute(muted: boolean) {
    this.mic?.getAudioTracks().forEach((t) => {
      t.enabled = !muted;
    });
    if (this.socket?.readyState === WebSocket.OPEN)
      this.socket.send(JSON.stringify({ type: "mute", muted }));
  }

  finish() {
    if (this.disposed || this.phase === "finishing") return;
    if (this.phase !== "active") {
      this.close("");
      return;
    }
    this.phase = "finishing";
    this.seconds = Math.round((Date.now() - this.startedAt) / 1000);
    this.callbacks.phase("finishing");
    clearInterval(this.pulse);
    this.mic?.getTracks().forEach((t) => t.stop());
    this.timeout(40000, "Не удалось получить итог занятия.");
    if (this.socket?.readyState === WebSocket.OPEN)
      this.socket.send(JSON.stringify({ type: "finish" }));
    else this.close("Нет связи с сервером Mira.");
  }

  close(message: string, save = true) {
    if (this.disposed) return;
    this.disposed = true;
    clearTimeout(this.deadline);
    clearInterval(this.pulse);
    this.mic?.getTracks().forEach((t) => t.stop());
    this.channel?.close();
    this.peer?.close();
    this.socket?.close();
    this.audio.srcObject = null;
    if (save && this.startedAt)
      this.callbacks.save(this.id, {
        ...this.settings,
        startedAt: this.startedAt,
        seconds: this.usage || this.seconds || Math.round((Date.now() - this.startedAt) / 1000),
        ...(this.notes ?? {
          summary: this.caption.slice(-1200) || missingTutorNotes,
          homework: "",
          partial: true,
        }),
        homeworkDone: false,
      });
    this.callbacks.ended(message);
  }
}
