import Content from "@/components/assistant/content.tsx";
import Footer from "@/components/assistant/footer.tsx";
import Header from "@/components/assistant/header.tsx";
import Suggestions from "@/components/assistant/suggestions.tsx";
import { useAssistant } from "@/hooks/use-assistant.ts";
import { cn } from "@/lib/utils.ts";
import {
  assistant_suggest1,
  assistant_suggest2,
  assistant_suggest3,
} from "@/paraglide/messages.js";

type AssistantContainerProps = {
  onClose: () => void;
};

export default function AssistantContainer({
  onClose,
}: AssistantContainerProps) {
  const { message, isStreaming, error, sendMessage } = useAssistant();
  const hasMessage = message !== null;

  return (
    <div
      className={cn(
        "grid size-full",
        hasMessage
          ? "grid-rows-[auto_1fr_auto]"
          : "grid-rows-[auto_1fr_auto_auto]"
      )}
    >
      <Header onClose={onClose} />
      <Content isStreaming={isStreaming} message={message} />
      {!hasMessage && (
        <Suggestions
          onClick={sendMessage}
          suggestions={[
            assistant_suggest1(),
            assistant_suggest2(),
            assistant_suggest3(),
          ]}
        />
      )}
      <Footer error={error} isStreaming={isStreaming} onSubmit={sendMessage} />
    </div>
  );
}
