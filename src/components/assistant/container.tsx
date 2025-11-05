import { useState } from "react";
import Header from "@/components/assistant/header.tsx";
import Input from "@/components/assistant/input.tsx";
import AssistantResponse from "@/components/assistant/response.tsx";
import Suggestions from "@/components/assistant/suggestions.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { SITE_CONFIG } from "@/config/site.ts";
import generateAssistantResponseFn from "@/fn/generate-assistant-response.ts";
import { cn } from "@/lib/utils.ts";

export default function AssistantContainer() {
  const [messages, setMessages] = useState<string>("");

  const hasMessage = !!messages;

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
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      return errorMessage;
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
        <AssistantResponse response={messages} />
      </ScrollArea>
      {!hasMessage && (
        <Suggestions
          onClick={(msg) => {
            clearMessages();
            return sendMessage(msg);
          }}
          suggestions={SITE_CONFIG.assistant.defaultSuggestions}
        />
      )}
      <Input
        onClearMessages={clearMessages}
        onSubmit={(_, formData) => {
          clearMessages();
          return sendMessage(formData.get("message") as string);
        }}
      />
    </div>
  );
}
