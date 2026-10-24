import { createFileRoute } from "@tanstack/react-router";
import { handleTranslationRequest } from "@/lib/translation-server";

export const Route = createFileRoute("/api/translate")({
  server: {
    handlers: {
      POST: ({ request }) => handleTranslationRequest(request),
    },
  },
});
