import { useRef } from "react";
import { type CommandContext, execute } from "@/commands";
import generateAssistantResponseFn from "@/fn/generate-assistant-response.ts";
import { ui_error_unexpected } from "@/paraglide/messages.js";
import {
  useAssistantActions,
  useAssistantError,
  useAssistantMessage,
  useAssistantStatus,
  useHasAssistantMessage,
} from "@/store/assistant.ts";
import { useThemeStore } from "@/store/theme.ts";

export function useAssistant() {
  const { setTheme } = useThemeStore();
  const message = useAssistantMessage();
  const status = useAssistantStatus();
  const error = useAssistantError();
  const hasMessage = useHasAssistantMessage();
  const {
    setResponse,
    setThinking,
    appendChunk,
    setIdle,
    setError,
    clearError,
    clear,
  } = useAssistantActions();

  const abortRef = useRef<AbortController | null>(null);

  const handleCommand = async (input: string): Promise<boolean> => {
    const context: CommandContext = {
      clearMessages: clear,
      setTheme,
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

  const handleAssistantMessage = async (
    prompt: string,
    signal: AbortSignal
  ) => {
    setThinking();

    try {
      const handler = generateAssistantResponseFn({ data: { prompt } });

      for await (const msg of await handler) {
        if (signal.aborted) {
          break;
        }
        appendChunk(msg as string);
      }

      if (!signal.aborted) {
        setIdle();
      }
    } catch (err) {
      if (signal.aborted) {
        return;
      }
      setError(err instanceof Error ? err.message : ui_error_unexpected());
    }
  };

  const sendMessage = async (input: string): Promise<void> => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const trimmedMsg = input.trim();

    const isCommand = await handleCommand(trimmedMsg);
    if (isCommand) {
      return;
    }

    await handleAssistantMessage(trimmedMsg, abortRef.current.signal);
  };

  const cancel = () => {
    abortRef.current?.abort();
    setIdle();
  };

  return {
    message,
    status,
    error,
    sendMessage,
    hasMessage,
    clear,
    cancel,
  };
}
