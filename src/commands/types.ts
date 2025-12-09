import type { LucideIcon } from "lucide-react";

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
  usage?: string;
  examples?: string[];
  handler: CommandHandler<T>;
};
