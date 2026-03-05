import Welcome from "@/components/assistant/welcome";
import ScrollAreaWithAnchor from "@/components/common/scroll-area-with-anchor";
import { Response } from "@/components/ui/ai-elements/response";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { assistant_thinking } from "@/paraglide/messages.js";
import type { AssistantStatus } from "@/store/assistant";

interface AssistantContentProps {
  message: string | null;
  status: AssistantStatus;
}

export default function AssistantContent({
  message,
  status,
}: AssistantContentProps) {
  const renderContent = () => {
    if (status === "thinking") {
      return (
        <TextShimmer className="text-sm">{assistant_thinking()}</TextShimmer>
      );
    }

    if (message) {
      return (
        <Response isAnimating={status === "streaming"} mode="static">
          {message}
        </Response>
      );
    }

    return <Welcome />;
  };

  return (
    <ScrollAreaWithAnchor className="size-full p-2">
      {renderContent()}
    </ScrollAreaWithAnchor>
  );
}
