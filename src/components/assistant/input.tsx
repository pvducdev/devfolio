import { type ChangeEvent, useActionState, useRef, useState } from "react";
import SlashCommandPopover from "@/components/assistant/slash-command-popover.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import type { SlashCommand } from "@/config/slash-commands.ts";
import { useKeyPress } from "@/hooks/use-keyboard.ts";

/**
 * Keyboard keys used in the component
 */
const KEYS = {
  ENTER: "Enter",
  TAB: "Tab",
  ARROW_DOWN: "ArrowDown",
  ARROW_UP: "ArrowUp",
  ESCAPE: "Escape",
} as const;

/**
 * Special character that triggers slash command popover
 */
const SLASH_COMMAND_TRIGGER = "/";

/**
 * Props for the AssistantInput component
 */
type AiInputProps = {
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Form submission handler with action state management */
  onSubmit: (state: string, formData: FormData) => string | Promise<string>;
};

/**
 * Assistant input component with slash command support
 *
 * Features:
 * - Slash command autocomplete popover
 * - Keyboard navigation (Enter, Tab, Arrow keys, Escape)
 * - Form submission with pending state
 * - Error message display
 */
export default function AssistantInput({
  placeholder = "Feel free to ask...",
  onSubmit,
}: AiInputProps) {
  const [errMessage, formAction, isPending] = useActionState(onSubmit, "");
  const [inputValue, setInputValue] = useState("");
  const [showCommands, setShowCommands] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Ref to forward keyboard events (ArrowUp/ArrowDown) to the popover
   * for keyboard navigation between command items
   */
  const forwardKeyRef = useRef<((key: string) => void) | null>(null);

  /**
   * Ref to get the currently selected command from the popover
   * Used when user presses Enter or Tab to select a command
   */
  const getSelectedCommandRef = useRef<(() => SlashCommand | null) | null>(
    null
  );

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    /**
     * Show command popover when:
     * 1. User types "/" (initial trigger)
     * 2. User continues typing after "/" (command filtering)
     *
     * The condition `value.startsWith("/") && inputValue === "/"` detects
     * when user adds characters after typing the initial slash.
     */
    setShowCommands(
      value === SLASH_COMMAND_TRIGGER ||
        (value.startsWith(SLASH_COMMAND_TRIGGER) &&
          inputValue === SLASH_COMMAND_TRIGGER)
    );
  };

  /**
   * Handle command selection from the popover
   * Updates input value and returns focus to textarea
   */
  const handleCommandSelect = (command: SlashCommand) => {
    setInputValue(`${SLASH_COMMAND_TRIGGER}${command.name}`);
    setShowCommands(false);
    textareaRef.current?.focus();
  };

  /**
   * Submit the form programmatically
   * Blocked when command popover is open to prevent accidental submission
   */
  const submitForm = () => {
    const form = textareaRef.current?.form;
    if (form && !showCommands) {
      form.requestSubmit();
      setInputValue("");
    }
  };

  // Submit form on Enter (when commands popover is closed)
  useKeyPress(KEYS.ENTER, submitForm, {
    target: textareaRef.current,
    modifiers: { shift: false },
    enabled: !showCommands,
    preventDefault: true,
  });

  // Select command on Enter or Tab (when commands popover is open)
  useKeyPress(
    [KEYS.ENTER, KEYS.TAB],
    () => {
      // Get the currently selected command and trigger selection
      const selectedCommand = getSelectedCommandRef.current?.();
      if (selectedCommand) {
        handleCommandSelect(selectedCommand);
      }
    },
    {
      target: textareaRef.current,
      enabled: showCommands,
      preventDefault: true,
    }
  );

  // Forward arrow key navigation to popover
  useKeyPress(
    [KEYS.ARROW_DOWN, KEYS.ARROW_UP],
    (e) => {
      if (forwardKeyRef.current) {
        forwardKeyRef.current(e.key);
      }
    },
    {
      target: textareaRef.current,
      enabled: showCommands,
      preventDefault: true,
    }
  );

  // Close popover on Escape
  useKeyPress(KEYS.ESCAPE, () => setShowCommands(false), {
    target: textareaRef.current,
    enabled: showCommands,
    preventDefault: true,
  });

  return (
    <form action={formAction} className="space-y-1 p-1">
      <SlashCommandPopover
        inputValue={inputValue}
        onCommandSelect={handleCommandSelect}
        onKeyboardNavigate={(handler, getSelectedCommand) => {
          forwardKeyRef.current = handler;
          getSelectedCommandRef.current = getSelectedCommand;
        }}
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
