import type { LucideIcon } from "lucide-react";
import { Eraser } from "lucide-react";

export type CommandContext = {
  clearMessages: () => void;
  setInputValue: (value: string) => void;
};

export type SlashCommand = {
  name: string;
  description: string;
  icon?: LucideIcon;
  handler: (context: CommandContext) => void | Promise<void>;
};

export const SLASH_COMMANDS: SlashCommand[] = [
  {
    name: "clear",
    description: "Clear all messages and reset the conversation",
    icon: Eraser,
    handler: (context) => {
      context.clearMessages();
      context.setInputValue("");
    },
  },
];

const SLASH_PREFIX = /^\//;

export function filterCommands(query: string): SlashCommand[] {
  const searchTerm = query.toLowerCase().replace(SLASH_PREFIX, "").trim();

  if (!searchTerm) {
    return SLASH_COMMANDS;
  }

  return SLASH_COMMANDS.filter(
    (cmd) =>
      cmd.name.toLowerCase().includes(searchTerm) ||
      cmd.description.toLowerCase().includes(searchTerm)
  );
}
