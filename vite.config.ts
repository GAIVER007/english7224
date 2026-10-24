// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "node:path";
import type { Plugin } from "vite";

import { generateOfflineWorker } from "./scripts/generate-offline.mjs";

function offlineWorkerPlugin(): Plugin {
  let clientOutputDir: string | undefined;
  return {
    name: "speakup-offline-worker",
    apply: "build",
    enforce: "post",
    sharedDuringBuild: true,
    writeBundle(options) {
      if (this.environment.name === "client" && options.dir) {
        clientOutputDir = path.resolve(options.dir);
      }
    },
    async buildStart() {
      if (this.environment.name !== "nitro") return;
      if (!clientOutputDir) throw new Error("Client output is unavailable for offline generation.");
      await generateOfflineWorker(clientOutputDir);
    },
  };
}

export default defineConfig({
  plugins: [offlineWorkerPlugin()],
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
