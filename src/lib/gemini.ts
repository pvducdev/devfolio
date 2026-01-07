import { GoogleGenAI } from "@google/genai";
import { createServerOnlyFn } from "@tanstack/react-start";
import { SITE_CONFIG } from "@/config/site.ts";
import systemInstruction from "@/config/system-prompt";
import { env } from "@/env/server";
import { getLogger } from "@/lib/logger/client.ts";

const getClient = createServerOnlyFn(
  () =>
    new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    })
);

export const generateMessage = createServerOnlyFn(async (prompt: string) => {
  try {
    const res = await getClient().models.generateContentStream({
      contents: prompt,
      model: SITE_CONFIG.assistant.model,
      config: {
        systemInstruction,
        temperature: SITE_CONFIG.assistant.temperature,
      },
    });

    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    getLogger().error(`[gemini] Failed to generate message: ${message}`, {
      model: SITE_CONFIG.assistant.model,
      userPrompt: prompt,
    });

    throw err;
  }
});
