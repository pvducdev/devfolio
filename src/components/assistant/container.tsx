import { useState } from "react";
import Header from "@/components/assistant/header.tsx";
import Input from "@/components/assistant/input.tsx";
import Response from "@/components/assistant/response.tsx";
import Suggestions from "@/components/assistant/suggestions.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import generateAssistantResponseFn from "@/fn/generate-assistant-response.ts";
import { cn } from "@/lib/utils.ts";

export default function AssistantContainer() {
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
    <div className="grid size-full grid-rows-[auto_1fr_auto_auto] overflow-hidden">
      <Header />
      <ScrollArea
        className={cn(
          "w-full p-2",
          hasMessage ? "h-[calc(100vh-166px)]" : "h-[calc(100vh-300px)]"
        )}
      >
        <Response response={messages} />
      </ScrollArea>
      <Suggestions
        onClick={(msg) => {
          clearMessages();
          return sendMessage(msg);
        }}
        suggestions={suggestions}
      />
      <Input
        onSubmit={(_, formData) => {
          clearMessages();
          return sendMessage(formData.get("message") as string);
        }}
      />
    </div>
  );
}
