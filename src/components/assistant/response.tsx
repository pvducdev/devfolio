import { ClientOnly } from "@tanstack/react-router";
import { Dog } from "lucide-react";
import { Response } from "@/components/ai-elements/response.tsx";
import { SITE_CONFIG } from "@/config/site.ts";
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
    return (
      <div className="relative mt-20 flex min-h-40 w-full flex-col items-center rounded-md border p-6 text-center font-mono text-sm">
        <span className="-top-2.5 absolute left-3 bg-background px-2">
          {SITE_CONFIG.assistant.name}
        </span>
        <p className="mt-2 mb-6 text-pretty leading-7">
          {SITE_CONFIG.assistant.welcome}
        </p>
        <Dog className="size-24 text-primary" />
      </div>
    );
  }

  return (
    <ClientOnly>
      <Response>{displayedText}</Response>
    </ClientOnly>
  );
}
