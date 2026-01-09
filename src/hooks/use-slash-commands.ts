import { useState } from "react";
import { type CommandItem, SLASH_PREFIX } from "./use-assistant";

interface UseSlashCommandsOptions {
  onCommandSelect?: (command: CommandItem) => void;
}

export function useSlashCommands(options: UseSlashCommandsOptions = {}) {
  const [inputValue, setInputValue] = useState("");
  const [showCommands, setShowCommands] = useState(false);

  const formattedInput = inputValue
    ? inputValue.replace(SLASH_PREFIX, "")
    : inputValue;

  const shouldShowCommands = (value: string): boolean =>
    value.startsWith(SLASH_PREFIX) && !value.includes(" ");

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setShowCommands(shouldShowCommands(value));
  };

  const handleCommandSelect = (command: CommandItem) => {
    setInputValue(`${SLASH_PREFIX}${command.name} `);
    setShowCommands(false);
    options.onCommandSelect?.(command);
  };

  const clearInput = () => {
    setInputValue("");
  };

  return {
    inputValue,
    formattedInput,
    showCommands,
    handleInputChange,
    handleCommandSelect,
    setShowCommands,
    clearInput,
  };
}
