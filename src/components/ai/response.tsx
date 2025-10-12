import { Dog } from "lucide-react";
import { Response } from "@/components/ai-elements/response.tsx";

type AiResponseProps = {
  response: string;
};
export default function AiResponse({ response }: AiResponseProps) {
  if (!response) {
    return (
      <div className="relative mt-20 flex min-h-40 w-full flex-col items-center rounded-md border border-pink-400 p-6 text-center font-mono text-gray-200 text-sm">
        <span className="-top-2.5 absolute left-3 bg-white px-2 text-pink-400">
          D Assistant
        </span>
        <p className="mt-2 mb-6 text-foreground leading-7">Good morning!</p>
        <Dog className="size-24 text-pink-400" />
      </div>
    );
  }

  return <Response>{response}</Response>;
}
