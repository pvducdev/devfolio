import { GoogleGenAI } from "@google/genai";
import geminiSystemPrompt from "@/config/gemini-system-prompt.txt?raw";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateMessage = async (prompt: string) => {
  const response = await client.models.generateContent({
    contents: prompt,
    model: "gemini-2.5-flash-lite",
    config: {
      systemInstruction: geminiSystemPrompt,
    },
  });

  return response.text;
};
