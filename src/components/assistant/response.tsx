import { Response } from "@/components/ai-elements/response.tsx";
import AssistantWelcome from "@/components/assistant/welcome.tsx";
import { useTypewriter } from "@/hooks/use-typewriter.ts";

type AiResponseProps = {
  response: string;
};

export default function AssistantResponse({ response }: AiResponseProps) {
  const { displayedText } = useTypewriter(response, {
    // Fast preset for responsive AI chat experience (60 chars/sec)
    speed: "fast",
    mode: "character",
  });

  if (!response) {
    return <AssistantWelcome />;
  }

  return <Response>{displayedText}</Response>;
}
