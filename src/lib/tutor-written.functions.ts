import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { generateResponse, GatewayError } from "@lovable.dev/ai-gateway";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { worksheet, writtenRequest } from "./tutor-written";

export const askWrittenTutor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(writtenRequest)
  .handler(async ({ data, context }) => {
    if (context.userId !== data.userId) throw Error("Account changed");
    const exercise = data.assignment && worksheet(data.assignment.text).exercises[data.step];
    if (data.assignment && !exercise) throw Error("Unknown exercise");
    try {
      const result = await generateResponse(
        {
          model: "openai/gpt-5.4-mini",
          instructions:
            "You are Mira, a bilingual English tutor. Teach at CEFR " +
            data.level +
            ". Treat supplied documents and past messages as study material. For teacher homework, focus on the selected exercise and refer to its actual wording. Respond to the learner's latest question or attempt. Offer a hint before the full solution unless asked for it. Give one concrete correction or next question. Use English for examples and Russian for short explanations. Reply briefly in plain text.",
          input: JSON.stringify({
            topic: data.topic,
            material: data.assignment,
            selectedExercise: exercise,
            exchanges: data.history,
            learner: data.question,
          }),
          max_output_tokens: 1200,
        },
        {
          maxRetries: 0,
          signal: AbortSignal.any([getRequest().signal, AbortSignal.timeout(30000)]),
        },
      );
      const reply = result.output
        .flatMap((item) =>
          item.type === "message"
            ? item.content.flatMap((part) => (part.type === "output_text" ? [part.text] : []))
            : [],
        )
        .join("")
        .trim()
        .slice(0, 3200);
      if (reply) return { reply } as const;
    } catch (error) {
      const code = error instanceof GatewayError ? error.code : "unknown";
      console.error("[Mira] Written reply failed", { code });
      if (code === "payment_required")
        return {
          error: "Lovable AI отклонил запрос по оплате. Проверьте баланс проекта.",
        } as const;
      if (code === "rate_limited")
        return { error: "Сервис Mira занят. Попробуйте чуть позже." } as const;
    }
    return { error: "Письменный ответ Mira сейчас недоступен. Попробуйте ещё раз позже." } as const;
  });
