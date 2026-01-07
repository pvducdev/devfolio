import {
  cmd_execute_failed,
  cmd_execute_unknown,
} from "@/paraglide/messages.js";
import { clearCommand } from "./assistant/clear";
import { helpCommand } from "./assistant/help";
import { getCommand, registerCommand } from "./registry";
import { setThemeCommand } from "./theme/set-theme";
import type { CommandContext, CommandResult } from "./types";

// biome-ignore lint/performance/noBarrelFile: intentional command registry pattern
export { getCommand, listCommands, registerCommand } from "./registry";
export type { Command, CommandContext, CommandResult } from "./types";

registerCommand(setThemeCommand);
registerCommand(clearCommand);
registerCommand(helpCommand);

const WHITESPACE_PATTERN = /\s+/;
const COMMAND_PREFIX = "/";

export function execute(
  input: string,
  context: CommandContext
): Promise<CommandResult> | CommandResult | null {
  if (!input.startsWith(COMMAND_PREFIX)) {
    return null;
  }

  const trimmed = input.slice(COMMAND_PREFIX.length).trim();
  if (!trimmed) {
    return null;
  }

  const parts = trimmed.split(WHITESPACE_PATTERN);
  const name = parts[0];
  const args = parts.slice(1);

  const cmd = getCommand(name);
  if (!cmd) {
    return {
      success: false,
      message: cmd_execute_unknown({ name }),
    };
  }

  try {
    return cmd.handler(args, context);
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : cmd_execute_failed(),
    };
  }
}

export const SLASH_PREFIX = COMMAND_PREFIX;
