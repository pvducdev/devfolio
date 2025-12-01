import { useShallow } from "zustand/react/shallow";
import { Response } from "@/components/ai-elements/response.tsx";
import { useAssistantStore } from "@/store/assistant.ts";

export default function AssistantResponse({ content }: { content: string }) {
  const isStreaming = useAssistantStore(
    useShallow((state) => state.isStreaming)
  );

  return <Response isAnimating={isStreaming}>{content}</Response>;
}
