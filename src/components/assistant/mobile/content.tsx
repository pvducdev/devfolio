import AssistantSuggestions from "@/components/assistant/suggestions";
import ScrollAreaWithAnchor from "@/components/common/scroll-area-with-anchor";
import { Response } from "@/components/ui/ai-elements/response";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { SITE_CONFIG } from "@/config/site";
import { assistant_thinking, assistant_welcome } from "@/paraglide/messages.js";
import type { AssistantStatus } from "@/store/assistant";

interface MobileAssistantContentProps {
  message: string | null;
  status: AssistantStatus;
  hasMessage: boolean;
  suggestions: readonly string[];
  onSuggestionClick: (suggestion: string) => Promise<void>;
}

export default function MobileAssistantContent({
  message,
  status,
  hasMessage,
  suggestions,
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
      <div className="w-full max-w-sm space-y-4 border border-dashed p-4">
        <div className="space-y-1 text-center font-mono">
          <p className="text-foreground text-sm">
            {SITE_CONFIG.assistant.name}
          </p>
          <p className="text-muted-foreground text-xs">{assistant_welcome()}</p>
        </div>
        {!hasMessage && (
          <AssistantSuggestions
            onClick={onSuggestionClick}
            suggestions={suggestions}
          />
        )}
      </div>
    </div>
  );
}
