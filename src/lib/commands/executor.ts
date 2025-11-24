import type { createCommandRegistry } from "./registry";
import type { CommandContext, CommandResult, ParsedCommand } from "./types";

function createErrorResult(message: string): CommandResult {
  return {
    success: false,
    message,
  };
}

export async function executeCommand(
  parsed: ParsedCommand,
  context: CommandContext,
  registry: ReturnType<typeof createCommandRegistry>
): Promise<CommandResult> {
  const command = registry.get(parsed.name);

  if (!command) {
    return createErrorResult(`Command not found: /${parsed.name}`);
  }

  try {
    return await command.handler(parsed.args, context);
  } catch (error) {
    return createErrorResult(
      error instanceof Error ? error.message : "Command failed"
    );
  }
}

export function createCommandExecutor(
  registry: ReturnType<typeof createCommandRegistry>
) {
  return {
    execute: (parsed: ParsedCommand, context: CommandContext) =>
      executeCommand(parsed, context, registry),
  };
}
