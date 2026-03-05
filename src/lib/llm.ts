import { createServerOnlyFn } from "@tanstack/react-start";
import Groq from "groq-sdk";
import { SITE_CONFIG } from "@/config/site";
import systemInstruction from "@/config/system-prompt";
import { env } from "@/env/server";
import { getLogger } from "@/lib/logger/client";

export const generateMessage = createServerOnlyFn(async (prompt: string) => {
  try {
    const client = new Groq({
      apiKey: env.LLM_API_KEY,
    });

    return await client.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt },
      ],
      model: SITE_CONFIG.assistant.model,
      temperature: SITE_CONFIG.assistant.temperature,
      stream: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    await getLogger().error(`[LLM] Failed to generate message: ${message}`, {
      model: SITE_CONFIG.assistant.model,
      userPrompt: prompt,
    });

    throw err;
  }
});
