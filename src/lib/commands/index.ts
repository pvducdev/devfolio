import { createCommandExecutor } from "./executor";
import { createCommandParser } from "./parser";
import { createCommandRegistry } from "./registry";
import type { CommandSystemConfig } from "./types";

export function createCommandSystem(config?: CommandSystemConfig) {
  const commandRegistry = createCommandRegistry();
  const commandParser = createCommandParser(config?.parser);
  const commandExecutor = createCommandExecutor(commandRegistry);

  return {
    registry: commandRegistry,
    parser: commandParser,
    executor: commandExecutor,
  };
}

export const { registry, parser, executor } = createCommandSystem();
