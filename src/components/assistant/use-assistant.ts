import type { LucideIcon } from "lucide-react";
import { Eraser, HelpCircle, MessageSquare, Palette } from "lucide-react";
import { useRef } from "react";

import {
  useAssistantActions,
  useAssistantError,
  useAssistantMessage,
  useAssistantStatus,
  useHasAssistantMessage,
} from "@/components/assistant/store";
import { useSetTheme } from "@/components/theme/store";
import { THEMES } from "@/config/theme";
import generateAssistantResponseFn from "@/fn/generate-assistant-response";
import { getLogger } from "@/lib/logger";
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

export interface CommandItem {
  name: string;
  description: string;
  icon?: LucideIcon;
  aliases?: string[];
  handler: (args: string[]) => void | Promise<void>;
}

export const SLASH_PREFIX = "/";

const WHITESPACE_PATTERN = /\s+/;

export const useAssistant = () => {
  const setTheme = useSetTheme();
  const message = useAssistantMessage();
  const status = useAssistantStatus();
  const errorState = useAssistantError();
  const hasMessage = useHasAssistantMessage();
  const { setMessage, setChunkMessage, setStatus, setError, clear } =
    useAssistantActions();

  const abortRef = useRef<AbortController | null>(null);

  const commands: CommandItem[] = [
    {
      aliases: ["?", "h"],
      description: cmd_help_desc(),
      handler: () => {
        const helpText = `**${cmd_help_list_title()}**

${commands.map((cmd) => `- **/${cmd.name}** - ${cmd.description}`).join("\n")}

${cmd_help_list_footer()}

${cmd_help_pro_tip()}`;
        setMessage(helpText);
      },
      icon: HelpCircle,
      name: "help",
    },
    {
      aliases: ["cls", "c"],
      description: cmd_clear_desc(),
      handler: () => clear(),
      icon: Eraser,
      name: "clear",
    },
    {
      aliases: ["t"],
      description: cmd_theme_desc(),
      handler: (args) => {
        const availableThemes = THEMES.map((t) => t.value).join(", ");

        if (!args[0]) {
          setError(cmd_theme_missing_arg({ themes: availableThemes }));
          return;
        }

        const theme = THEMES.find((t) => t.value === args[0].toLowerCase());
        if (!theme) {
          setError(
            cmd_theme_unknown({ themeName: args[0], themes: availableThemes })
          );
          return;
        }

        setTheme(theme.value);
      },
      icon: Palette,
      name: "theme",
    },
    {
      aliases: ["fb"],
      description: cmd_feedback_desc(),
      handler: async (args) => {
        const feedbackMessage = args.join(" ").trim();

        if (!feedbackMessage) {
          setError(cmd_feedback_empty());
          return;
        }

        try {
          await getLogger().info("User feedback submitted", {
            message: feedbackMessage,
            timestamp: new Date().toISOString(),
          });
        } catch {
          setError(cmd_feedback_failed());
        }
      },
      icon: MessageSquare,
      name: "feedback",
    },
  ];

  const executeCommand = async (input: string): Promise<boolean> => {
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
      setError(cmd_execute_unknown({ name }));
      return true;
    }

    await cmd.handler(args);
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
    } catch {
      if (signal.aborted) {
        return;
      }
      setError(ui_error_unexpected());
    }
  };

  const sendMessage = async (input: string): Promise<void> => {
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    setStatus("idle");

    if (await executeCommand(trimmed)) {
      return;
    }

    clear();
    await streamResponse(trimmed);
  };

  return {
    commands,
    error: errorState,
    hasMessage,
    message,
    sendMessage,
    status,
  };
};
