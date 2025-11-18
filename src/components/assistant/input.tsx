import { type ChangeEvent, useActionState, useRef } from "react";
import SlashCommandPopover from "@/components/assistant/slash-command-popover.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useCmdNav } from "@/hooks/use-cmd-nav.ts";
import { useKeyPress, useKeySequence } from "@/hooks/use-keyboard.ts";
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

  useKeyPress("Enter")
    .onTarget(textareaRef)
    .withModifiers({ shift: false })
    .preventDefault()
    .handle(submitForm);

  // Double-tap Escape to clear input
  useKeySequence(["Escape", "Escape"], clearInput, {
    timeout: 1000,
    target: textareaRef.current,
  });

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
          ref={textareaRef}
          value={inputValue}
        />
      </SlashCommandPopover>
      {errMessage && (
        <p className="text-pretty text-red-500 text-xs">{errMessage}</p>
      )}
    </form>
  );
}
