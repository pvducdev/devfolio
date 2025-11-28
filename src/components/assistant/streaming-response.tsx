import { Response } from "@/components/ai-elements/response.tsx";
import { useTypewriter } from "@/hooks/use-typewriter.ts";

type StreamingResponseProps = {
  response: string;
};

export default function StreamingResponse({
  response,
}: StreamingResponseProps) {
  const { displayedText } = useTypewriter(response, {
    speed: "fast",
    mode: "character",
  });

  return <Response>{displayedText}</Response>;
}
