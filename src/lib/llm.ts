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
        { content: systemInstruction, role: "system" },
        { content: prompt, role: "user" },
      ],
      model: SITE_CONFIG.assistant.model,
      stream: true,
      temperature: SITE_CONFIG.assistant.temperature,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    await getLogger().error(`[LLM] Failed to generate message: ${message}`, {
      model: SITE_CONFIG.assistant.model,
      userPrompt: prompt,
    });

    throw error;
  }
});
