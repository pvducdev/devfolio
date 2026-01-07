import type { Command } from "./types";

const commands = new Map<string, Command>();

export function registerCommand<T = unknown>(cmd: Command<T>): Command<T> {
  commands.set(cmd.name, cmd as Command);

  if (cmd.aliases) {
    for (const alias of cmd.aliases) {
      commands.set(alias, cmd as Command);
    }
  }

  return cmd;
}

export function getCommand(name: string): Command | undefined {
  return commands.get(name);
}

export function listCommands(): Command[] {
  return [...new Set(commands.values())];
}
