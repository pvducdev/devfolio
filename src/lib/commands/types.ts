import type { LucideIcon } from "lucide-react";

export type Command = {
  name: string;
  description: string;
  icon?: LucideIcon;
  handler: CommandHandler;
};

export type CommandHandler = (
  args: string[],
  context: CommandContext
) => Promise<CommandResult> | CommandResult;

export type ParsedCommand = {
  name: string;
  args: string[];
};

export type CommandResult = {
  success: boolean;
  message?: string;
  data?: unknown;
};

export type CommandContext = {
  clearMessages: () => void;
  setTheme: (theme: string) => void;
  navigate: (path: string) => void;
};

export type ParserConfig = {
  whitespacePattern?: RegExp;
  commandPrefix?: string;
};

export type CommandSystemConfig = {
  parser?: ParserConfig;
};
