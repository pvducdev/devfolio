import { createServerOnlyFn } from "@tanstack/react-start";
import { Groq } from "groq-sdk";

import { SITE_CONFIG } from "@/config/site";
import systemInstruction from "@/config/system-prompt";
import { env } from "@/env/server";

export const generateMessage = createServerOnlyFn((prompt: string) => {
  const client = new Groq({
    apiKey: env.LLM_API_KEY,
  });

  return client.chat.completions.create({
    messages: [
      { content: systemInstruction, role: "system" },
      { content: prompt, role: "user" },
    ],
    model: SITE_CONFIG.assistant.model,
    stream: true,
    temperature: SITE_CONFIG.assistant.temperature,
  });
});
