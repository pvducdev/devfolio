import Content from "@/components/assistant/content";
import Footer from "@/components/assistant/footer";
import Header from "@/components/assistant/header";
import Suggestions from "@/components/assistant/suggestions";
import { useAssistant } from "@/hooks/use-assistant";
import { cn } from "@/lib/utils";
import {
  assistant_suggest1,
  assistant_suggest2,
  assistant_suggest3,
} from "@/paraglide/messages.js";

interface AssistantContainerProps {
  onClose: () => void;
}

export default function AssistantContainer({
  onClose,
}: AssistantContainerProps) {
  const { commands, message, hasMessage, status, error, sendMessage } =
    useAssistant();

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
      <Content message={message} status={status} />
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
      <Footer
        commands={commands}
        disabled={status === "thinking"}
        error={error}
        onSubmit={sendMessage}
      />
    </div>
  );
}
