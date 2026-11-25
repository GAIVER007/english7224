import nodeAdapter from "crossws/adapters/node";
import type { Plugin } from "vite";
import { tutorPath } from "../src/lib/tutor";

export function tutorDev(): Plugin {
  return {
    name: "speakup-tutor",
    apply: "serve",
    configureServer(server) {
      const adapter = nodeAdapter({
        resolve: async () =>
          (await server.ssrLoadModule("/src/lib/tutor-relay.server.ts"))["tutorHooks"],
      });
      server.httpServer?.on("upgrade", (req, socket, head) => {
        if (req.url === tutorPath)
          void adapter.handleUpgrade(req, socket, head).catch(() => socket.destroy());
      });
      server.httpServer?.once("close", () => void adapter.close());
    },
  };
}
