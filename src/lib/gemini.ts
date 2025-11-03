import { GoogleGenAI } from "@google/genai";
import { createServerOnlyFn } from "@tanstack/react-start";
import geminiSystemPrompt from "@/config/prompts";
import { SITE_CONFIG } from "@/config/site.ts";

const getClient = createServerOnlyFn(
  () =>
    new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
);

export const generateMessage = createServerOnlyFn(async (prompt: string) =>
  getClient().models.generateContentStream({
    contents: prompt,
    model: SITE_CONFIG.assistant.model,
    config: {
      systemInstruction: geminiSystemPrompt,
    },
  })
);
