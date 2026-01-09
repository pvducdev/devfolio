import type { LucideIcon } from "lucide-react";
import { Eraser, HelpCircle, MessageSquare, Palette } from "lucide-react";
import { useRef } from "react";
import { THEMES } from "@/config/theme";
import generateAssistantResponseFn from "@/fn/generate-assistant-response.ts";
import { getLogger } from "@/lib/logger/client";
import {
  cmd_clear_desc,
  cmd_execute_unknown,
  cmd_feedback_desc,
  cmd_feedback_empty,
  cmd_feedback_failed,
  cmd_help_desc,
  cmd_help_list_footer,
  cmd_help_list_title,
  cmd_help_pro_tip,
  cmd_theme_desc,
  cmd_theme_missing_arg,
  cmd_theme_unknown,
  ui_error_unexpected,
} from "@/paraglide/messages.js";
import {
  useAssistantActions,
  useAssistantError,
  useAssistantMessage,
  useAssistantStatus,
  useHasAssistantMessage,
} from "@/store/assistant.ts";
import { useThemeStore } from "@/store/theme.ts";

export interface CommandItem {
  name: string;
  description: string;
  icon?: LucideIcon;
  aliases?: string[];
  handler: (args: string[]) => void | Promise<void>;
}

export const SLASH_PREFIX = "/";

const WHITESPACE_PATTERN = /\s+/;

export function useAssistant() {
  const { setTheme } = useThemeStore();
  const message = useAssistantMessage();
  const status = useAssistantStatus();
  const error = useAssistantError();
  const hasMessage = useHasAssistantMessage();
  const { setMessage, setChunkMessage, setStatus, clear } =
    useAssistantActions();

  const abortRef = useRef<AbortController | null>(null);

  const commands: CommandItem[] = [
    {
      name: "help",
      description: cmd_help_desc(),
      icon: HelpCircle,
      aliases: ["?", "h"],
      handler: () => {
        const helpText = `**${cmd_help_list_title()}**

${commands.map((cmd) => `- **/${cmd.name}** - ${cmd.description}`).join("\n")}

${cmd_help_list_footer()}

${cmd_help_pro_tip()}`;
        setMessage(helpText);
      },
    },
    {
      name: "clear",
      description: cmd_clear_desc(),
      icon: Eraser,
      aliases: ["cls", "c"],
      handler: () => clear(),
    },
    {
      name: "theme",
      description: cmd_theme_desc(),
      icon: Palette,
      aliases: ["t"],
      handler: (args) => {
        const availableThemes = THEMES.map((t) => t.value).join(", ");

        if (!args[0]) {
          setStatus(
            "error",
            cmd_theme_missing_arg({ themes: availableThemes })
          );
          return;
        }

        const theme = THEMES.find((t) => t.value === args[0].toLowerCase());
        if (!theme) {
          setStatus(
            "error",
            cmd_theme_unknown({ themeName: args[0], themes: availableThemes })
          );
          return;
        }

        setTheme(theme.value);
      },
    },
    {
      name: "feedback",
      description: cmd_feedback_desc(),
      icon: MessageSquare,
      aliases: ["fb"],
      handler: async (args) => {
        const feedbackMessage = args.join(" ").trim();

        if (!feedbackMessage) {
          setStatus("error", cmd_feedback_empty());
          return;
        }

        try {
          const logger = getLogger();
          await logger.info(`[User Feedback]: ${feedbackMessage}`);
          await logger.flush();
        } catch {
          setStatus("error", cmd_feedback_failed());
        }
      },
    },
  ];

  const executeCommand = (input: string): boolean => {
    if (!input.startsWith(SLASH_PREFIX)) {
      return false;
    }

    const [name, ...args] = input.slice(1).trim().split(WHITESPACE_PATTERN);
    if (!name) {
      return false;
    }

    const cmd = commands.find(
      (c) => c.name === name || c.aliases?.includes(name)
    );

    if (!cmd) {
      setStatus("error", cmd_execute_unknown({ name }));
      return true;
    }

    cmd.handler(args);
    return true;
  };

  const streamResponse = async (prompt: string) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    setStatus("thinking");

    try {
      const stream = generateAssistantResponseFn({ data: { prompt } });

      for await (const chunk of await stream) {
        if (signal.aborted) {
          break;
        }
        setChunkMessage(chunk);
      }

      if (!signal.aborted) {
        setStatus("idle");
      }
    } catch (err) {
      if (signal.aborted) {
        return;
      }
      setStatus(
        "error",
        err instanceof Error ? err.message : ui_error_unexpected()
      );
    }
  };

  const sendMessage = async (input: string): Promise<void> => {
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    setStatus("idle");

    if (executeCommand(trimmed)) {
      return;
    }

    clear();
    await streamResponse(trimmed);
  };

  const cancel = () => {
    abortRef.current?.abort();
    setStatus("idle");
  };

  return {
    commands,
    message,
    status,
    error,
    hasMessage,
    sendMessage,
    clear,
    cancel,
  };
}
