import { useState } from "react";
import { SLASH_PREFIX, type SlashCommand } from "@/config/slash-commands.ts";

type UseSlashCommandsOptions = {
  onCommandSelect?: (command: SlashCommand) => void;
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

  const handleCommandSelect = (command: SlashCommand) => {
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
