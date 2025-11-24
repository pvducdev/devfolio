import type { ParsedCommand, ParserConfig } from "./types";

const DEFAULT_WHITESPACE_PATTERN = /\s+/;
const DEFAULT_COMMAND_PREFIX = "/";

export function createCommandParser(config?: ParserConfig) {
  const whitespacePattern =
    config?.whitespacePattern ?? DEFAULT_WHITESPACE_PATTERN;
  const commandPrefix = config?.commandPrefix ?? DEFAULT_COMMAND_PREFIX;

  function parse(input: string): ParsedCommand | null {
    if (!input.startsWith(commandPrefix)) {
      return null;
    }

    const trimmed = input.slice(commandPrefix.length).trim();
    if (!trimmed) {
      return null;
    }

    const parts = trimmed.split(whitespacePattern);
    const name = parts[0];
    const args = parts.slice(1);

    return { name, args };
  }

  return {
    parse,
  };
}
