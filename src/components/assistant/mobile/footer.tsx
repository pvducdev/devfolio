import MobileAssistantInput from "@/components/assistant/mobile/input";
import { mobile_assistant_placeholder } from "@/paraglide/messages.js";

interface MobileAssistantFooterProps {
  error: string | null;
  disabled: boolean;
  onSubmit: (message: string) => void;
}

export default function MobileAssistantFooter({
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
        disabled={disabled}
        onSubmit={onSubmit}
        placeholder={mobile_assistant_placeholder()}
      />
    </div>
  );
}
