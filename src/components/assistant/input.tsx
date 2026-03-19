import { useRef } from "react";
import type { ChangeEvent } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import SlashCommandPopover from "@/components/assistant/slash-command-popover";
import { selectHighlightedCommand } from "@/components/assistant/utils";
import { Textarea } from "@/components/ui/textarea";
import type { CommandItem } from "@/hooks/use-assistant";
import { useCmdNav } from "@/hooks/use-cmd-nav";
import { useSlashCommands } from "@/hooks/use-slash-commands";

interface AssistantInputProps {
  commands: CommandItem[];
  placeholder?: string;
  disabled?: boolean;
  onSubmit: (message: string) => void;
}

export default function AssistantInput({
  commands,
  placeholder = "Type something...",
  disabled = false,
  onSubmit,
}: AssistantInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);

  const {
    inputValue,
    formattedInput,
    showCommands,
    handleInputChange: updateSlashCommands,
    handleCommandSelect: selectSlashCommand,
    setShowCommands,
    clearInput,
  } = useSlashCommands({
    onCommandSelect: () => textareaRef.current?.focus(),
  });

  const forwardKeyToCommandPopover = useCmdNav({
    commandRef,
    onTabSelect: () => selectHighlightedCommand(commandRef.current),
    showCommands,
  });

  const submitForm = () => {
    const trimmedInput = inputValue.trim();
    if (showCommands || disabled || !trimmedInput) {
      return;
    }

    onSubmit(trimmedInput);
    clearInput();
    textareaRef.current?.focus();
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateSlashCommands(e.target.value);
  };

  const enterRef = useHotkeys<HTMLTextAreaElement>(
    "enter",
    (e) => {
      if (e.shiftKey) {
        return;
      }
      submitForm();
    },
    { enableOnFormTags: ["TEXTAREA"], preventDefault: true }
  );

  const escapeRef = useHotkeys<HTMLTextAreaElement>(
    "escape>escape",
    clearInput,
    { enableOnFormTags: ["TEXTAREA"] }
  );

  const mergedRef = (node: HTMLTextAreaElement | null) => {
    textareaRef.current = node;
    enterRef.current = node;
    escapeRef.current = node;
  };

  return (
    <div className="space-y-1 p-1">
      <SlashCommandPopover
        commandRef={commandRef}
        commands={commands}
        inputValue={formattedInput}
        onCommandSelect={selectSlashCommand}
        onOpenChange={setShowCommands}
        open={showCommands}
      >
        <Textarea
          className="resize-none"
          disabled={disabled}
          onChange={handleInputChange}
          onKeyDown={forwardKeyToCommandPopover}
          placeholder={placeholder}
          ref={mergedRef}
          value={inputValue}
        />
      </SlashCommandPopover>
    </div>
  );
}
