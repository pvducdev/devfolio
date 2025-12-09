import { type ChangeEvent, useCallback, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import SlashCommandPopover from "@/components/assistant/slash-command-popover.tsx";
import { selectHighlightedCommand } from "@/components/assistant/utils.ts";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useCmdNav } from "@/hooks/use-cmd-nav.ts";
import { useSlashCommands } from "@/hooks/use-slash-commands.ts";

type AssistantInputProps = {
  placeholder?: string;
  disabled?: boolean;
  onSubmit: (message: string) => void;
};

export default function AssistantInput({
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
    showCommands,
    onTabSelect: () => selectHighlightedCommand(commandRef.current),
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

  // Enter without shift to submit (scoped to textarea)
  const enterRef = useHotkeys<HTMLTextAreaElement>(
    "enter",
    (e) => {
      if (e.shiftKey) {
        return;
      }
      submitForm();
    },
    { preventDefault: true, enableOnFormTags: ["TEXTAREA"] }
  );

  // Double escape to clear (scoped to textarea)
  const escapeRef = useHotkeys<HTMLTextAreaElement>(
    "escape>escape",
    clearInput,
    { enableOnFormTags: ["TEXTAREA"] }
  );

  // Merge refs for textarea
  const mergedRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;
      enterRef.current = node;
      escapeRef.current = node;
    },
    [enterRef, escapeRef]
  );

  return (
    <div className="space-y-1 p-1">
      <SlashCommandPopover
        commandRef={commandRef}
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
