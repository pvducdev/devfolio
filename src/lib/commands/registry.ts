import type { Command } from "./types";

export function createCommandRegistry() {
  const commands = new Map<string, Command>();

  return {
    register(command: Command): void {
      commands.set(command.name, command);
    },

    get(name: string): Command | undefined {
      return commands.get(name);
    },

    list(): Command[] {
      return Array.from(commands.values());
    },

    has(name: string): boolean {
      return commands.has(name);
    },

    unregister(name: string): void {
      commands.delete(name);
    },
  };
}
