import type { LucideIcon } from "lucide-react";

const WHITESPACE_PATTERN = /\s+/;
const COMMAND_PREFIX = "/";

export type CommandResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type CommandContext = {
  clearMessages: () => void;
  setTheme: (theme: string) => void;
  navigate: (path: string) => void;
};

export type CommandHandler<T = unknown> = (
  args: string[],
  context: CommandContext
) => Promise<CommandResult<T>> | CommandResult<T>;

export type Command<T = unknown> = {
  name: string;
  description: string;
  icon?: LucideIcon;
  aliases?: string[];
  handler: CommandHandler<T>;
};

const commands = new Map<string, Command>();

export function defineCommand<T = unknown>(cmd: Command<T>): Command<T> {
  commands.set(cmd.name, cmd as Command);
  if (cmd.aliases) {
    for (const alias of cmd.aliases) {
      commands.set(alias, cmd as Command);
    }
  }
  return cmd;
}

export function listCommands(): Command[] {
  return [...new Set(commands.values())];
}

export function getCommand(name: string): Command | undefined {
  return commands.get(name);
}

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

  const cmd = commands.get(name);
  if (!cmd) {
    return { success: false, message: `Unknown command: /${name}` };
  }

  try {
    return cmd.handler(args, context);
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Command failed",
    };
  }
}

export const SLASH_PREFIX = COMMAND_PREFIX;
