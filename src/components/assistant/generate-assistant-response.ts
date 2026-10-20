import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import {
  maxLength,
  minLength,
  object,
  parse,
  pipe,
  string,
  transform,
} from "valibot";

import { generateMessage, LLM_MODEL } from "@/components/assistant/llm";
import { getLogger } from "@/lib/logger";
import { typewriterStream } from "@/lib/typewriter-stream";
import { rateLimitMiddleware } from "@/middleware/rate-limit";

const PROMPT_MAX_LENGTH = 500;

const InputSchema = object({
  prompt: pipe(
    string(),
    transform((val) => val.trim()),
    minLength(1, "Prompt is required"),
    maxLength(PROMPT_MAX_LENGTH, "Prompt is too long")
  ),
});

const generateAssistantResponse = createServerFn()
  .middleware([rateLimitMiddleware])
  .validator((data: unknown) => parse(InputSchema, data))
  .handler(async function* generateAssistantResponse({ data }) {
    try {
      const response = await generateMessage(data.prompt, getRequest().signal);

      const chunks = (async function* chunks() {
        for await (const chunk of response) {
          yield chunk.choices[0]?.delta?.content ?? "";
        }
      })();

      for await (const word of typewriterStream(chunks)) {
        yield word;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      await getLogger().error("Failed to stream assistant message", {
        error: message,
        model: LLM_MODEL,
        userPrompt: data.prompt,
      });
      throw error;
    }
  });

export default generateAssistantResponse;
