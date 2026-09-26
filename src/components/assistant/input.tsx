import { useRef } from "react";
import type { ChangeEvent } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Textarea } from "@/components/ui/textarea";

import SlashCommandPopover, {
  forwardKeyToCommandList,
} from "./slash-command-popover";
import type { CommandItem } from "./use-assistant";
import { useSlashCommands } from "./use-slash-commands";

interface AssistantInputProps {
  commands: CommandItem[];
  placeholder: string;
  disabled: boolean;
  onSubmit: (message: string) => void;
}

export default function AssistantInput({
  commands,
  placeholder,
  disabled,
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
    enterRef(node);
    escapeRef(node);
  };

  return (
    <div className="space-y-1 p-1">
      <SlashCommandPopover
        anchorRef={textareaRef}
        commandRef={commandRef}
        commands={commands}
        inputValue={formattedInput}
        onCommandSelect={selectSlashCommand}
        onOpenChange={setShowCommands}
        open={showCommands}
      />
      <Textarea
        className="resize-none"
        disabled={disabled}
        onChange={handleInputChange}
        onKeyDown={(event) => {
          if (showCommands) {
            forwardKeyToCommandList(event, commandRef.current);
          }
        }}
        placeholder={placeholder}
        ref={mergedRef}
        value={inputValue}
      />
    </div>
  );
}
