import ScrollAreaWithAnchor from "@/components/assistant/scroll-area-with-anchor";
import type { AssistantStatus } from "@/components/assistant/store";
import AssistantSuggestions from "@/components/assistant/suggestions";
import { Response } from "@/components/ui/ai-elements/response";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { SITE_CONFIG } from "@/config/site";
import { assistant_thinking, assistant_welcome } from "@/paraglide/messages.js";

interface MobileAssistantContentProps {
  message: string | null;
  status: AssistantStatus;
  onSuggestionClick: (suggestion: string) => Promise<void>;
}

export default function MobileAssistantContent({
  message,
  status,
  onSuggestionClick,
}: MobileAssistantContentProps) {
  if (status === "thinking") {
    return (
      <div className="flex flex-1 px-4 pt-4">
        <TextShimmer className="font-mono text-sm">
          {assistant_thinking()}
        </TextShimmer>
      </div>
    );
  }

  if (message) {
    return (
      <ScrollAreaWithAnchor className="flex-1 px-4 py-3">
        <Response isAnimating={status === "streaming"} mode="static">
          {message}
        </Response>
      </ScrollAreaWithAnchor>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="relative w-full max-w-sm space-y-4 border border-dashed p-4 pt-5">
        <span className="absolute -top-2.5 left-3 bg-background px-2 font-mono text-foreground text-sm">
          {SITE_CONFIG.assistant.name}
        </span>
        <div className="space-y-1 font-mono">
          <p className="text-muted-foreground text-xs">{assistant_welcome()}</p>
        </div>
        <AssistantSuggestions onClick={onSuggestionClick} />
      </div>
    </div>
  );
}
