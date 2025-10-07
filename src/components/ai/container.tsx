import { useState } from "react";
import AiHeader from "@/components/ai/header.tsx";
import AiInput from "@/components/ai/input.tsx";
import AiResponse from "@/components/ai/response.tsx";
import AiSuggestions from "@/components/ai/Suggestions.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { cn } from "@/lib/utils.ts";

export default function AiContainer() {
  const [response, setResponse] = useState<string>("");

  const hasResponse = !!response;

  const suggestions = hasResponse
    ? []
    : [
        "What’s D’s specialty?",
        "How does D solve problems?",
        "What tech does D like most?",
      ];

  const sendMessage = async (message: string) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return "";

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      if (!res.ok) {
        return `Error: ${res.statusText}`;
      }

      const data = await res.json();
      setResponse(data);

      return "";
    } catch (err) {
      if (err instanceof Error) {
        return err.message;
      }

      return "Failed to send message.";
    }
  };

  return (
    <div className="size-full overflow-hidden">
      <AiHeader />
      <ScrollArea
        className={cn("w-full p-2", hasResponse ? "h-[80vh]" : "h-[60vh]")}
      >
        <AiResponse response={response} />
      </ScrollArea>
      <AiSuggestions suggestions={suggestions} onClick={sendMessage} />
      <AiInput
        onSubmit={(_, formData) =>
          sendMessage(formData.get("message") as string)
        }
      />
    </div>
  );
}
