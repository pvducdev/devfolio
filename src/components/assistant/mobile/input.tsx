import { type ChangeEvent, type FormEvent, useRef } from "react";
import type { CommandItem } from "@/hooks/use-assistant";
import { useSlashCommands } from "@/hooks/use-slash-commands";

interface MobileAssistantInputProps {
  commands: CommandItem[];
  placeholder?: string;
  disabled?: boolean;
  onSubmit: (message: string) => void;
}

export default function MobileAssistantInput({
  commands: _commands,
  placeholder = "Type a message...",
  disabled = false,
  onSubmit,
}: MobileAssistantInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    inputValue,
    handleInputChange: updateSlashCommands,
    clearInput,
  } = useSlashCommands();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (disabled || !trimmed) {
      return;
    }

    onSubmit(trimmed);
    clearInput();
    inputRef.current?.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateSlashCommands(e.target.value);
  };

  return (
    <form
      className="flex items-center gap-2 border-t border-dashed px-3 py-2 pb-[env(safe-area-inset-bottom)]"
      onSubmit={handleSubmit}
    >
      <input
        className="flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground"
        disabled={disabled}
        onChange={handleChange}
        placeholder={placeholder}
        ref={inputRef}
        type="text"
        value={inputValue}
      />
      <button
        className="border border-dashed px-2 py-1 font-mono text-muted-foreground text-xs transition-colors active:bg-foreground active:text-background disabled:opacity-30"
        disabled={disabled || !inputValue.trim()}
        type="submit"
      >
        {">"}
      </button>
    </form>
  );
}
