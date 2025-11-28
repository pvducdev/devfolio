import { useNavigate } from "@tanstack/react-router";
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
import { useAssistantStore } from "@/store/assistant.ts";
import { useThemeStore } from "@/store/theme.ts";
import "@/commands";
import AssistantWelcome from "@/components/assistant/welcome.tsx"; // Register commands

type AssistantContainerProps = {
  onClose: () => void;
};

export default function AssistantContainer({
  onClose,
}: AssistantContainerProps) {
  const navigate = useNavigate();
  const { setTheme } = useThemeStore();
  const {
    message,
    isStreaming,
    setImmediateResponse,
    startStreamingResponse,
    appendChunk,
    finishStreamingResponse,
    setError,
    clear,
  } = useAssistantStore();

  const hasResponse = !!message;

  const handleCommand = async (parsed: ReturnType<typeof parser.parse>) => {
    if (!parsed) {
      return false;
    }

    const context: CommandContext = {
      clearMessages: clear,
      setTheme,
      navigate: (path) => navigate({ to: path }),
    };

    const result = await executor.execute(parsed, context);

    if (!result.success) {
      setError(result.message || "Command failed");
      return true;
    }

    if (parsed.name === "help") {
      setImmediateResponse(result.message as string);
    }

    return true;
  };

  const handleAssistantMessage = async (prompt: string) => {
    startStreamingResponse();

    try {
      const handler = generateAssistantResponseFn({ data: { prompt } });

      for await (const msg of await handler) {
        appendChunk(msg as string);
      }

      finishStreamingResponse();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    }
  };

  const sendMessage = async (input: string): Promise<void> => {
    const trimmedMsg = input.trim();
    const parsed = parser.parse(trimmedMsg);

    const isCommand = await handleCommand(parsed);
    if (isCommand) {
      return;
    }

    await handleAssistantMessage(trimmedMsg);
  };

  const { error } = useAssistantStore();

  return (
    <div className="grid size-full grid-rows-[auto_1fr_auto_auto] overflow-hidden">
      <Header onClose={onClose} />
      <ScrollArea
        className={cn(
          "w-full p-2",
          hasResponse ? "h-[calc(100vh-166px)]" : "h-[calc(100vh-300px)]"
        )}
      >
        {message ? (
          <AssistantResponse message={message} />
        ) : (
          <AssistantWelcome />
        )}
      </ScrollArea>
      {!hasResponse && (
        <Suggestions
          onClick={sendMessage}
          suggestions={SITE_CONFIG.assistant.defaultSuggestions}
        />
      )}
      <div className="space-y-1">
        {error && (
          <p className="text-pretty px-2 text-red-500 text-xs">{error}</p>
        )}
        <Input
          disabled={isStreaming}
          onSubmit={sendMessage}
          placeholder={SITE_CONFIG.assistant.inputPlaceholder}
        />
      </div>
    </div>
  );
}
