import {
  type ChangeEvent,
  type KeyboardEvent,
  useActionState,
  useRef,
  useState,
} from "react";
import SlashCommandPopover from "@/components/assistant/slash-command-popover.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { SLASH_PREFIX, type SlashCommand } from "@/config/slash-commands.ts";
import { useKeyPress } from "@/hooks/use-keyboard.ts";

const ESC_DOUBLE_PRESS_THRESHOLD = 1000; // ms

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
  const commandRef = useRef<HTMLDivElement>(null);
  const lastEscPressRef = useRef<number>(0);

  const formattedInput = inputValue
    ? inputValue.replace(SLASH_PREFIX, "")
    : inputValue;

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    setShowCommands(value.startsWith(SLASH_PREFIX) && !value.includes(" "));
  };

  const handleCommandSelect = (command: SlashCommand) => {
    setInputValue(`${SLASH_PREFIX}${command.name} `);
    textareaRef.current?.focus();
  };

  const submitForm = () => {
    const form = textareaRef.current?.form;
    if (!form || showCommands || isPending) {
      return;
    }

    form.requestSubmit();
    setInputValue("");
    textareaRef.current?.focus();
  };

  function selectHighlightedCommandItem() {
    const el = commandRef.current?.querySelector(
      '[cmdk-item=""][aria-selected="true"]'
    );
    if (!el) {
      return;
    }

    const event = new Event("cmdk-item-select");
    el.dispatchEvent(event);
  }

  const forwardKeyToCommandPopover = (
    e: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (!showCommands) {
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      selectHighlightedCommandItem();
      return;
    }

    const interactiveKeys = ["ArrowUp", "ArrowDown", "Enter", "Escape"];

    if (interactiveKeys.includes(e.key)) {
      commandRef.current?.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: e.key,
          code: e.code,
          bubbles: true,
          cancelable: true,
        })
      );
      e.preventDefault();
    }
  };

  const handleEscapePress = () => {
    const now = Date.now();
    const timeSinceLastPress = now - lastEscPressRef.current;

    if (timeSinceLastPress < ESC_DOUBLE_PRESS_THRESHOLD) {
      setInputValue("");
      lastEscPressRef.current = 0;
      return;
    }

    lastEscPressRef.current = now;
  };

  useKeyPress("Enter", submitForm, {
    target: textareaRef.current,
    modifiers: { shift: false },
    preventDefault: true,
  });

  useKeyPress("Escape", handleEscapePress, {
    target: textareaRef.current,
  });

  return (
    <form action={formAction} className="space-y-1 p-1">
      <SlashCommandPopover
        commandRef={commandRef}
        inputValue={formattedInput}
        onCommandSelect={handleCommandSelect}
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
