import { Response } from "@/components/ai-elements/response.tsx";
import StreamingResponse from "@/components/assistant/streaming-response.tsx";
import type { AssistantMessage } from "@/store/assistant.ts";

type AssistantResponseProps = {
  message: AssistantMessage;
};

export default function AssistantResponse({ message }: AssistantResponseProps) {
  if (message.type === "streaming") {
    return <StreamingResponse response={message.content} />;
  }

  return <Response>{message.content}</Response>;
}
