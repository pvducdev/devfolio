import { type ChangeEvent, useActionState, useCallback, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import SlashCommandPopover from "@/components/assistant/slash-command-popover.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useCmdNav } from "@/hooks/use-cmd-nav.ts";
import { useSlashCommands } from "@/hooks/use-slash-commands.ts";
import { selectHighlightedCommand } from "./utils.ts";

type AssistantInputProps = {
  placeholder?: string;
  onSubmit: (state: string, formData: FormData) => string | Promise<string>;
};

export default function AssistantInput({
  placeholder = "Type something...",
  onSubmit,
}: AssistantInputProps) {
  const [errMessage, formAction, isPending] = useActionState(onSubmit, "");
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
    const form = textareaRef.current?.form;
    if (!form || showCommands || isPending) {
      return;
    }

    form.requestSubmit();
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
    <form action={formAction} className="space-y-1 p-1">
      <SlashCommandPopover
        commandRef={commandRef}
        inputValue={formattedInput}
        onCommandSelect={selectSlashCommand}
        onOpenChange={setShowCommands}
        open={showCommands}
      >
        <Textarea
          className="resize-none"
          name="message"
          onChange={handleInputChange}
          onKeyDown={forwardKeyToCommandPopover}
          placeholder={placeholder}
          ref={mergedRef}
          value={inputValue}
        />
      </SlashCommandPopover>
      {errMessage && (
        <p className="text-pretty text-red-500 text-xs">{errMessage}</p>
      )}
    </form>
  );
}
