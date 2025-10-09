import { useState } from "react";
import AiHeader from "@/components/ai/header.tsx";
import AiInput from "@/components/ai/input.tsx";
import AiResponse from "@/components/ai/response.tsx";
import AiSuggestions from "@/components/ai/Suggestions.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import generateAssistantResponseFn from "@/fn/generateAssistantResponse.ts";
import { cn } from "@/lib/utils.ts";

export default function AiContainer() {
  const [messages, setMessages] = useState<string>("");

  const hasMessage = !!messages;

  const suggestions = hasMessage
    ? []
    : [
        "What’s D’s specialty?",
        "How does D solve problems?",
        "What tech does D like most?",
      ];

  const clearMessages = () => {
    setMessages("");
  };

  const sendMessage = async (message: string): Promise<string> => {
    try {
      const handler = generateAssistantResponseFn({
        data: { prompt: message },
      });

      for await (const msg of await handler) {
        const chunk = msg;
        setMessages((prev) => prev + chunk);
      }

      return "";
    } catch (err) {
      return (err as Error)?.message || "Failed to send message.";
    }
  };

  return (
    <div className="size-full overflow-hidden">
      <AiHeader />
      <ScrollArea
        className={cn("w-full p-2", hasMessage ? "h-[80vh]" : "h-[60vh]")}
      >
        <AiResponse response={messages} />
      </ScrollArea>
      <AiSuggestions
        suggestions={suggestions}
        onClick={(msg) => {
          clearMessages();
          return sendMessage(msg);
        }}
      />
      <AiInput
        onSubmit={(_, formData) => {
          clearMessages();
          return sendMessage(formData.get("message") as string);
        }}
      />
    </div>
  );
}
