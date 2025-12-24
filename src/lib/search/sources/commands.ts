import { listCommands } from "@/commands";

import { createSource, type SearchSource } from "../core/source";
import type { DefaultSearchItem } from "../core/types";

function buildCommandItems(): DefaultSearchItem[] {
  const commands = listCommands();

  return commands.map((cmd) => ({
    id: `commands:${cmd.name}`,
    title: `/${cmd.name}`,
    description: cmd.description,
    keywords: cmd.aliases,
    category: "command" as const,
    icon: cmd.icon,
    shortcut: cmd.usage,
    action: { type: "command" as const, commandName: cmd.name },
  }));
}

export function createCommandsSource(): SearchSource<DefaultSearchItem> {
  return createSource({
    id: "commands",
    name: "Commands",
    category: "command",
    priority: 90,
    fetch: buildCommandItems,
  });
}

export { buildCommandItems };
