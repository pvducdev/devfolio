import Input from "@/components/assistant/input.tsx";
import { assistant_placeholder } from "@/paraglide/messages.js";

type AssistantFooterProps = {
  error: string | null;
  isStreaming: boolean;
  onSubmit: (message: string) => void;
};

export default function AssistantFooter({
  error,
  isStreaming,
  onSubmit,
}: AssistantFooterProps) {
  return (
    <div className="space-y-1">
      {!!error && (
        <p className="text-pretty px-2 text-red-500 text-xs">{error}</p>
      )}
      <Input
        disabled={isStreaming}
        onSubmit={onSubmit}
        placeholder={assistant_placeholder()}
      />
    </div>
  );
}
