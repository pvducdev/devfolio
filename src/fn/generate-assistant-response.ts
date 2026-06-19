import { createServerFn } from "@tanstack/react-start";
import { minLength, object, parse, pipe, string, transform } from "valibot";

import { generateMessage } from "@/lib/llm";
import { getLogger } from "@/lib/logger/client";
import { typewriterStream } from "@/lib/typewriter-stream";

const InputSchema = pipe(
  object({
    prompt: pipe(
      string(),
      transform((val) => val.trim()),
      minLength(1, "Prompt is required")
    ),
  })
);

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
        userPrompt: data.prompt,
      });
      yield "\n\n*An error occurred while generating the response.*";
    }
  });

export default generateAssistantResponse;
