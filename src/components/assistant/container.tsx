import { useNavigate } from "@tanstack/react-router";
import Header from "@/components/assistant/header.tsx";
import Input from "@/components/assistant/input.tsx";
import Response from "@/components/assistant/response.tsx";
import Suggestions from "@/components/assistant/suggestions.tsx";
import Welcome from "@/components/assistant/welcome.tsx";
import ScrollAreaWithAnchor from "@/components/common/scroll-area-with-anchor.tsx";
import { SITE_CONFIG } from "@/config/site.ts";
import generateAssistantResponseFn from "@/fn/generate-assistant-response.ts";
import { type CommandContext, execute } from "@/lib/commands";
import { cn } from "@/lib/utils.ts";
import { useAssistantStore } from "@/store/assistant.ts";
import { useThemeStore } from "@/store/theme.ts";
import "@/commands";

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
    setResponse,
    startStreaming,
    appendChunk,
    finishStreaming,
    setError,
    clear,
  } = useAssistantStore();

  const handleCommand = async (input: string): Promise<boolean> => {
    const context: CommandContext = {
      clearMessages: clear,
      setTheme,
      navigate: (path) => navigate({ to: path }),
    };

    const result = await execute(input, context);

    if (result === null) {
      return false;
    }

    if (!result.success) {
      setError(result.message || "Command failed");
      return true;
    }

    if (
      result.message &&
      (input.startsWith("/help") ||
        input.startsWith("/h ") ||
        input === "/h" ||
        input.startsWith("/?"))
    ) {
      setResponse(result.message);
    }

    return true;
  };

  const handleAssistantMessage = async (prompt: string) => {
    startStreaming();

    try {
      const handler = generateAssistantResponseFn({ data: { prompt } });

      for await (const msg of await handler) {
        appendChunk(msg as string);
      }

      finishStreaming();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    }
  };

  const sendMessage = async (input: string): Promise<void> => {
    const trimmedMsg = input.trim();

    const isCommand = await handleCommand(trimmedMsg);
    if (isCommand) {
      return;
    }

    await handleAssistantMessage(trimmedMsg);
  };

  const { error } = useAssistantStore();

  return (
    <div
      className={cn(
        "grid size-full grid-rows-[auto_1fr_auto_auto]",
        message ? "grid-rows-[auto_1fr_auto]" : "grid-rows-[auto_1fr_auto_auto]"
      )}
    >
      <Header onClose={onClose} />
      <ScrollAreaWithAnchor className="size-full p-2">
        {message ? <Response content={message} /> : <Welcome />}
      </ScrollAreaWithAnchor>
      {!message && (
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
