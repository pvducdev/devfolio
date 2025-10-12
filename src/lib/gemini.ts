import { GoogleGenAI } from "@google/genai";
import { createServerOnlyFn } from "@tanstack/react-start";
import geminiSystemPrompt from "@/config/gemini-system-prompt.txt?raw";

const getClient = createServerOnlyFn(
  () =>
    new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
);

export const generateMessage = createServerOnlyFn(async (prompt: string) =>
  getClient().models.generateContentStream({
    contents: prompt,
    model: "gemini-2.5-flash-lite",
    config: {
      systemInstruction: geminiSystemPrompt,
    },
  })
);
