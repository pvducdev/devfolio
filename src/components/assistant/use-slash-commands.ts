import { useState } from "react";

import { SLASH_PREFIX } from "./use-assistant";
import type { CommandItem } from "./use-assistant";

interface UseSlashCommandsOptions {
  onCommandSelect?: (command: CommandItem) => void;
}

const shouldShowCommands = (value: string): boolean =>
  value.startsWith(SLASH_PREFIX) && !value.includes(" ");

export const useSlashCommands = (options: UseSlashCommandsOptions = {}) => {
  const [inputValue, setInputValue] = useState("");
  const [showCommands, setShowCommands] = useState(false);

  const formattedInput = inputValue.replace(SLASH_PREFIX, "");

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
    clearInput,
    formattedInput,
    handleCommandSelect,
    handleInputChange,
    inputValue,
    setShowCommands,
    showCommands,
  };
};
