import { Response } from "@/components/ai-elements/response.tsx";
import AssistantWelcome from "@/components/assistant/welcome.tsx";
import { useTypewriter } from "@/hooks/use-typewriter.ts";
import type { AssistantMessage } from "@/store/assistant.ts";

type AssistantResponseProps = {
  message: AssistantMessage | null;
};

export default function AssistantResponse({ message }: AssistantResponseProps) {
  const isStreamingType = message?.type === "streaming";

  // Only use typewriter for streaming responses (LLM)
  const { displayedText } = useTypewriter(
    isStreamingType ? message.content : "",
    {
      speed: "fast",
      mode: "character",
    }
  );

  if (!message) {
    return <AssistantWelcome />;
  }

  // Immediate: render content directly (no animation)
  // Streaming: render animated typewriter text
  const content = isStreamingType ? displayedText : message.content;

  return <Response>{content}</Response>;
}
