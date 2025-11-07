import { Response } from "@/components/ai-elements/response.tsx";
import AssistantWelcome from "@/components/assistant/welcome.tsx";
import { useTypewriter } from "@/hooks/use-typewriter.ts";

type AiResponseProps = {
  response: string;
};

export default function AssistantResponse({ response }: AiResponseProps) {
  const { displayedText } = useTypewriter(response, {
    speedStages: [
      { duration: 3000, speed: 100 },
      { duration: Number.POSITIVE_INFINITY, speed: 200 },
    ],
  });

  if (!response) {
    return <AssistantWelcome />;
  }

  return <Response>{displayedText}</Response>;
}
