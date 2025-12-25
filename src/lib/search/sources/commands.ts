import { listCommands } from "@/commands";

import type { AppSearchItem } from "../react/types";

export function buildCommandItems(): AppSearchItem[] {
  const commands = listCommands();

  return commands.map((cmd) => ({
    id: `commands:${cmd.name}`,
    title: `/${cmd.name}`,
    description: cmd.description,
    keywords: cmd.aliases,
    meta: {
      category: "command" as const,
      icon: cmd.icon,
      shortcut: cmd.usage,
      action: { type: "command" as const, commandName: cmd.name },
    },
  }));
}
