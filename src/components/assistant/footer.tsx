import Input from "@/components/assistant/input.tsx";
import { assistant_placeholder } from "@/paraglide/messages.js";

interface AssistantFooterProps {
  error: string | null;
  disabled: boolean;
  onSubmit: (message: string) => void;
}

export default function AssistantFooter({
  error,
  disabled,
  onSubmit,
}: AssistantFooterProps) {
  return (
    <div className="space-y-1">
      {!!error && (
        <p className="text-pretty px-2 text-red-500 text-xs">{error}</p>
      )}
      <Input
        disabled={disabled}
        onSubmit={onSubmit}
        placeholder={assistant_placeholder()}
      />
    </div>
  );
}
