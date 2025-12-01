import { useState } from "react";
import { type Command, SLASH_PREFIX } from "@/lib/commands";

type UseSlashCommandsOptions = {
  onCommandSelect?: (command: Command) => void;
};

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

  const handleCommandSelect = (command: Command) => {
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
