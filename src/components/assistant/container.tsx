import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import Header from "@/components/assistant/header.tsx";
import Input from "@/components/assistant/input.tsx";
import AssistantResponse from "@/components/assistant/response.tsx";
import Suggestions from "@/components/assistant/suggestions.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { SITE_CONFIG } from "@/config/site.ts";
import generateAssistantResponseFn from "@/fn/generate-assistant-response.ts";
import { executor, parser } from "@/lib/commands";
import type { CommandContext } from "@/lib/commands/types";
import { cn } from "@/lib/utils.ts";
import { useThemeStore } from "@/store/theme.ts";
import "@/commands"; // Register commands

type AssistantContainerProps = {
  onClose: () => void;
};

export default function AssistantContainer({
  onClose,
}: AssistantContainerProps) {
  const [messages, setMessages] = useState<string>("");
  const navigate = useNavigate();
  const { setTheme } = useThemeStore();

  const hasMessage = !!messages;

  const clearMessages = () => {
    setMessages("");
  };

  const handleCommand = async (parsed: ReturnType<typeof parser.parse>) => {
    if (!parsed) {
      return null;
    }

    const context: CommandContext = {
      clearMessages,
      setTheme,
      navigate: (path) => navigate({ to: path }),
    };

    const result = await executor.execute(parsed, context);

    if (!result.success) {
      return result.message || "Command failed";
    }

    if (parsed.name === "help") {
      setMessages(result.message as string);
    }

    return "";
  };

  const handleAssistantMessage = async (prompt: string) => {
    try {
      const handler = generateAssistantResponseFn({ data: { prompt } });

      for await (const msg of await handler) {
        const chunk = msg;
        setMessages((prev) => prev + chunk);
      }

      return "";
    } catch (err) {
      return err instanceof Error
        ? err.message
        : "An unexpected error occurred";
    }
  };

  const sendMessage = async (message: string): Promise<string> => {
    const trimmedMsg = message.trim();
    const parsed = parser.parse(trimmedMsg);

    if (parsed) {
      const result = await handleCommand(parsed);
      return result || "";
    }

    return handleAssistantMessage(trimmedMsg);
  };

  return (
    <div className="grid size-full grid-rows-[auto_1fr_auto_auto] overflow-hidden">
      <Header onClose={onClose} />
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
        onSubmit={(_, formData) => {
          clearMessages();
          return sendMessage(formData.get("message") as string);
        }}
        placeholder={SITE_CONFIG.assistant.inputPlaceholder}
      />
    </div>
  );
}
