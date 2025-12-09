import { useNavigate } from "@tanstack/react-router";
import { type CommandContext, execute } from "@/commands";
import generateAssistantResponseFn from "@/fn/generate-assistant-response.ts";
import { ui_error_unexpected } from "@/paraglide/messages.js";
import { useAssistantStore } from "@/store/assistant.ts";
import { useThemeStore } from "@/store/theme.ts";

export function useAssistant() {
  const navigate = useNavigate();
  const { setTheme } = useThemeStore();
  const {
    message,
    isStreaming,
    error,
    setResponse,
    startStreaming,
    appendChunk,
    finishStreaming,
    setError,
    clearError,
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

    clearError();

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
      setError(err instanceof Error ? err.message : ui_error_unexpected());
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

  return {
    message,
    isStreaming,
    error,
    sendMessage,
    clear,
  };
}
