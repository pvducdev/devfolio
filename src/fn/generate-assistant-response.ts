import { createServerFn } from "@tanstack/react-start";
import { minLength, object, parse, pipe, string, transform } from "valibot";
import { generateMessage } from "@/lib/llm.ts";
import { getLogger } from "@/lib/logger/client.ts";
import { typewriterStream } from "@/lib/typewriter-stream.ts";

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
  .inputValidator((data: unknown) => parse(InputSchema, data))
  .handler(async function* ({ data }) {
    try {
      const response = await generateMessage(data.prompt);

      const chunks = (async function* () {
        for await (const chunk of response) {
          yield chunk.choices[0]?.delta?.content ?? "";
        }
      })();

      for await (const word of typewriterStream(chunks)) {
        yield word;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      getLogger().error("Failed to stream assistant message", {
        error: message,
        userPrompt: data.prompt,
      });
      yield "\n\n*An error occurred while generating the response.*";
    }
  });

export default generateAssistantResponse;
