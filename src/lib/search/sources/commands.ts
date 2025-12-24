import { listCommands } from "@/commands";

import type { SearchItem } from "../types";

export function buildCommandItems(): SearchItem[] {
  const commands = listCommands();

  return commands.map((cmd) => ({
    id: `command:${cmd.name}`,
    title: `/${cmd.name}`,
    description: cmd.description,
    keywords: cmd.aliases,
    category: "command" as const,
    icon: cmd.icon,
    shortcut: cmd.usage,
    action: { type: "command" as const, commandName: cmd.name },
  }));
}
