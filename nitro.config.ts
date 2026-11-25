import { defineConfig } from "nitro/config";

export default defineConfig({
  features: { websocket: true },
  handlers: [{ route: "/api/tutor/live", handler: "./server/tutor.ts" }],
});
