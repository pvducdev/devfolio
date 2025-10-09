import { createServerFn } from "@tanstack/react-start";
import { generateMessage } from "@/lib/gemini.ts";

const generateAssistantResponse = createServerFn()
  .inputValidator((data: { prompt: string }) => {
    const trimmedPrompt = data.prompt.trim();

    if (!trimmedPrompt) {
      throw new Error("Prompt is required");
    }

    return { prompt: trimmedPrompt };
  })
  .handler(async function* ({ data }) {
    const response = await generateMessage(data.prompt);

    for await (const chunk of response) {
      yield chunk.text;
    }
  });

export default generateAssistantResponse;
