import { ClientOnly } from "@tanstack/react-router";
import { Dog } from "lucide-react";
import { Response } from "@/components/ai-elements/response.tsx";

type AiResponseProps = {
  response: string;
};

export default function AssistantResponse({ response }: AiResponseProps) {
  if (!response) {
    return (
      <div className="relative mt-20 flex min-h-40 w-full flex-col items-center rounded-md border p-6 text-center font-mono text-sm">
        <span className="-top-2.5 absolute left-3 bg-background px-2">
          HeyD
        </span>
        <p className="mt-2 mb-6 leading-7">Good morning!</p>
        <Dog className="size-24 text-primary" />
      </div>
    );
  }

  return (
    <ClientOnly>
      <Response>{response}</Response>
    </ClientOnly>
  );
}
