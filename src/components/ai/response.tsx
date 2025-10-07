import { Dog } from "lucide-react";
import { Response } from "@/components/ai-elements/response.tsx";

type AiResponseProps = {
  response: string;
};
export default function AiResponse({ response }: AiResponseProps) {
  if (!response) {
    return (
      <div className="relative border border-pink-400 min-h-40 mt-20 rounded-md p-6 flex flex-col items-center text-center w-full font-mono text-sm text-gray-200">
        <span className="absolute bg-white -top-2.5 left-3 px-2 text-pink-400">
          D Assistant
        </span>
        <p className="text-foreground leading-7 mb-6 mt-2">Good morning!</p>
        <Dog className="size-24 text-pink-400" />
      </div>
    );
  }

  return <Response>{response}</Response>;
}
