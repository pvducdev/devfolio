import { Response } from "@/components/ai-elements/response.tsx";
import Welcome from "@/components/assistant/welcome.tsx";
import ScrollAreaWithAnchor from "@/components/common/scroll-area-with-anchor.tsx";
import { TextShimmer } from "@/components/ui/text-shimmer.tsx";
import { assistant_thinking } from "@/paraglide/messages.js";
import type { AssistantStatus } from "@/store/assistant.ts";

type AssistantContentProps = {
  message: string | null;
  status: AssistantStatus;
};

export default function AssistantContent({
  message,
  status,
}: AssistantContentProps) {
  return (
    <ScrollAreaWithAnchor className="size-full p-2">
      {status === "thinking" ? (
        <TextShimmer className="text-muted-foreground text-sm" duration={1.5}>
          {assistant_thinking()}
        </TextShimmer>
      ) : message ? (
        <Response isAnimating={status === "streaming"}>{message}</Response>
      ) : (
        <Welcome />
      )}
    </ScrollAreaWithAnchor>
  );
}
