import { createServerFn } from "@tanstack/react-start";
import { minLength, object, parse, pipe, string, transform } from "valibot";

import { SITE_CONFIG } from "@/config/site";
import { generateMessage } from "@/lib/llm";
import { getLogger } from "@/lib/logger";
import { typewriterStream } from "@/lib/typewriter-stream";

const InputSchema = object({
  prompt: pipe(
    string(),
    transform((val) => val.trim()),
    minLength(1, "Prompt is required")
  ),
});

const generateAssistantResponse = createServerFn()
  .validator((data: unknown) => parse(InputSchema, data))
  .handler(async function* generateAssistantResponse({ data }) {
    try {
      const response = await generateMessage(data.prompt);

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
        model: SITE_CONFIG.assistant.model,
        userPrompt: data.prompt,
      });
      throw error;
    }
  });

export default generateAssistantResponse;
