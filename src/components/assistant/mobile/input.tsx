import { useRef, useState } from "react";
import type { FormEvent } from "react";

interface MobileAssistantInputProps {
  placeholder: string;
  disabled: boolean;
  onSubmit: (message: string) => void;
}

export default function MobileAssistantInput({
  placeholder,
  disabled,
  onSubmit,
}: MobileAssistantInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (disabled || !trimmed) {
      return;
    }

    onSubmit(trimmed);
    setInputValue("");
    inputRef.current?.focus();
  };

  return (
    <form
      className="flex items-center gap-2 border-t border-dashed px-3 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      onSubmit={handleSubmit}
    >
      <input
        className="flex-1 bg-transparent font-mono text-base outline-none placeholder:text-muted-foreground"
        disabled={disabled}
        onChange={(event) => setInputValue(event.target.value)}
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
