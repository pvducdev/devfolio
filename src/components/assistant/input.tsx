import { type ChangeEvent, useActionState, useRef, useState } from "react";
import SlashCommandPopover from "@/components/assistant/slash-command-popover.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import type { SlashCommand } from "@/config/slash-commands.ts";
import { useKeyPress } from "@/hooks/use-keyboard.ts";

type AiInputProps = {
  placeholder?: string;
  onSubmit: (state: string, formData: FormData) => string | Promise<string>;
};

export default function AssistantInput({
  placeholder = "Type to something...",
  onSubmit,
}: AiInputProps) {
  const [errMessage, formAction, isPending] = useActionState(onSubmit, "");
  const [inputValue, setInputValue] = useState("");
  const [showCommands, setShowCommands] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    setShowCommands(
      value === "/" || (value.startsWith("/") && inputValue === "/")
    );
  };

  const handleCommandSelect = (command: SlashCommand) => {
    setInputValue(`/${command.name}`);
    setShowCommands(false);
  };

  const submitForm = () => {
    const form = textareaRef.current?.form;
    if (form && !showCommands) {
      form.requestSubmit();
      setInputValue("");
    }
  };

  useKeyPress("Enter", submitForm, {
    target: textareaRef.current,
    modifiers: { shift: false },
    preventDefault: true,
  });

  useKeyPress("Escape", () => setShowCommands(false), {
    target: textareaRef.current,
    enabled: showCommands,
    preventDefault: true,
  });

  return (
    <form action={formAction} className="space-y-1 p-1">
      <SlashCommandPopover
        inputValue={inputValue}
        onCommandSelect={handleCommandSelect}
        onOpenChange={setShowCommands}
        open={showCommands}
      >
        <Textarea
          className="resize-none"
          disabled={isPending}
          name="message"
          onChange={handleInputChange}
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
