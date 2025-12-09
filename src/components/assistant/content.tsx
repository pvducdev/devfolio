import { Response } from "@/components/ai-elements/response.tsx";
import Welcome from "@/components/assistant/welcome.tsx";
import ScrollAreaWithAnchor from "@/components/common/scroll-area-with-anchor.tsx";

type AssistantContentProps = {
  message: string | null;
  isStreaming: boolean;
};

export default function AssistantContent({
  message,
  isStreaming,
}: AssistantContentProps) {
  return (
    <ScrollAreaWithAnchor className="size-full p-2">
      {message ? (
        <Response isAnimating={isStreaming}>{message}</Response>
      ) : (
        <Welcome />
      )}
    </ScrollAreaWithAnchor>
  );
}
