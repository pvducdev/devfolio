import {
  mobile_assistant_close,
  mobile_assistant_prompt,
} from "@/paraglide/messages.js";

interface MobileAssistantHeaderProps {
  onClose: () => void;
}

export default function MobileAssistantHeader({
  onClose,
}: MobileAssistantHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-dashed px-4 py-3 font-mono text-xs">
      <span className="text-muted-foreground">{mobile_assistant_prompt()}</span>
      <button
        className="text-muted-foreground transition-colors active:text-foreground"
        onClick={onClose}
        type="button"
      >
        {mobile_assistant_close()}
      </button>
    </div>
  );
}
