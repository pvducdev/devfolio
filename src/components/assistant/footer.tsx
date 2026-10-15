import Input from "@/components/assistant/input";
import type { CommandItem } from "@/components/assistant/use-assistant";
import { assistant_placeholder } from "@/paraglide/messages.js";

interface AssistantFooterProps {
  commands: CommandItem[];
  error: string | null;
  disabled: boolean;
  onSubmit: (message: string) => void;
}

export default function AssistantFooter({
  commands,
  error,
  disabled,
  onSubmit,
}: AssistantFooterProps) {
  return (
    <div className="space-y-1">
      {!!error && (
        <p className="text-pretty px-2 text-destructive text-xs">{error}</p>
      )}
      <Input
        commands={commands}
        disabled={disabled}
        onSubmit={onSubmit}
        placeholder={assistant_placeholder()}
      />
    </div>
  );
}
