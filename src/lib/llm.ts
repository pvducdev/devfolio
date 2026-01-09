import { createServerOnlyFn } from "@tanstack/react-start";
import Groq from "groq-sdk";
import { SITE_CONFIG } from "@/config/site.ts";
import systemInstruction from "@/config/system-prompt";
import { env } from "@/env/server";
import { getLogger } from "@/lib/logger/client.ts";

const getClient = createServerOnlyFn(
  () =>
    new Groq({
      apiKey: env.LLM_API_KEY,
    })
);

export const generateMessage = createServerOnlyFn(async (prompt: string) => {
  try {
    const stream = await getClient().chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt },
      ],
      model: SITE_CONFIG.assistant.model,
      temperature: SITE_CONFIG.assistant.temperature,
      stream: true,
    });

    return stream;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    getLogger().error(`[LLM] Failed to generate message: ${message}`, {
      model: SITE_CONFIG.assistant.model,
      userPrompt: prompt,
    });

    throw err;
  }
});
