import { createServerOnlyFn } from "@tanstack/react-start";
import { Groq } from "groq-sdk";

import systemInstruction from "@/components/assistant/system-prompt";
import { env } from "@/env/server";

export const LLM_MODEL = "openai/gpt-oss-120b";

const LLM_TEMPERATURE = 0.7;

export const generateMessage = createServerOnlyFn(
  (prompt: string, signal: AbortSignal) => {
    const client = new Groq({
      apiKey: env.LLM_API_KEY,
    });

    return client.chat.completions.create(
      {
        messages: [
          { content: systemInstruction, role: "system" },
          { content: prompt, role: "user" },
        ],
        model: LLM_MODEL,
        stream: true,
        temperature: LLM_TEMPERATURE,
      },
      { signal }
    );
  }
);
