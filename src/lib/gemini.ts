import { GoogleGenAI } from "@google/genai";
import { createServerOnlyFn } from "@tanstack/react-start";
import { SITE_CONFIG } from "@/config/site.ts";
import systemInstruction from "@/config/system-prompt";
import { env } from "@/env";

const getClient = createServerOnlyFn(
  () =>
    new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    })
);

export const generateMessage = createServerOnlyFn(async (prompt: string) =>
  getClient().models.generateContentStream({
    contents: prompt,
    model: SITE_CONFIG.assistant.model,
    config: {
      systemInstruction,
      temperature: SITE_CONFIG.assistant.temperature,
    },
  })
);
