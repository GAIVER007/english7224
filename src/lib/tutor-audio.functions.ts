import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { transcribeAudio, generateSpeech } from "@lovable.dev/ai-gateway";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { writtenMessageLimit } from "./tutor";

const extensions: Record<string, string> = {
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mp4": "mp4",
  "audio/wav": "wav",
};

export const transcribeTutorMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.instanceof(FormData))
  .handler(async ({ data, context }) => {
    if (data.get("userId") !== context.userId) throw Error("Account changed");
    const audio = data.get("audio");
    if (!audio || typeof audio === "string" || !audio.size || audio.size > 12 * 1024 * 1024)
      return { error: "Запишите сообщение длительностью до двух минут." } as const;
    const type = audio.type.split(";")[0]!.toLowerCase();
    const ext = extensions[type];
    if (!ext)
      return {
        error:
          "Этот формат аудио не поддерживается. Можно воспользоваться диктовкой или ввести текст.",
      } as const;
    const response = await transcribeAudio(
      {
        model: "openai/gpt-4o-mini-transcribe",
        file: new File([audio], "message." + ext, { type }),
      },
      { maxRetries: 0, signal: AbortSignal.any([getRequest().signal, AbortSignal.timeout(30000)]) },
    );
    const text = (typeof response === "string" ? response : response.text).trim();
    if (!text)
      return {
        error: "Не удалось разобрать речь. Попробуйте записать сообщение ещё раз.",
      } as const;
    if (text.length > writtenMessageLimit)
      return { error: "Получился длинный ответ. Запишите реплику покороче." } as const;
    return { text } as const;
  });

export const voiceTutorReply = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ userId: z.string().uuid(), text: z.string().trim().min(1).max(3200) }))
  .handler(async ({ data, context }) => {
    if (data.userId !== context.userId) throw Error("Account changed");
    const audio = await generateSpeech(
      {
        model: "openai/gpt-4o-mini-tts",
        voice: "coral",
        input: data.text,
        response_format: "mp3",
      },
      { maxRetries: 0, signal: AbortSignal.any([getRequest().signal, AbortSignal.timeout(30000)]) },
    );
    return new Response(audio.body, {
      headers: { "Content-Type": audio.contentType, "Cache-Control": "no-store" },
    });
  });
