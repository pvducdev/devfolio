import MobileAssistantInput from "@/components/assistant/mobile/input";
import type { CommandItem } from "@/hooks/use-assistant";
import { mobile_assistant_placeholder } from "@/paraglide/messages.js";

interface MobileAssistantFooterProps {
  commands: CommandItem[];
  error: string | null;
  disabled: boolean;
  onSubmit: (message: string) => void;
}

export default function MobileAssistantFooter({
  commands,
  error,
  disabled,
  onSubmit,
}: MobileAssistantFooterProps) {
  return (
    <div>
      {!!error && (
        <p className="px-3 text-destructive text-xs">
          {">"} ERR: {error}
        </p>
      )}
      <MobileAssistantInput
        commands={commands}
        disabled={disabled}
        onSubmit={onSubmit}
        placeholder={mobile_assistant_placeholder()}
      />
    </div>
  );
}
