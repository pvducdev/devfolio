import { cn } from "cn";

import Content from "./content";
import Footer from "./footer";
import Header from "./header";
import Suggestions from "./suggestions";
import { useAssistant } from "./use-assistant";

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
      {!hasMessage && <Suggestions onClick={sendMessage} />}
      <Footer
        commands={commands}
        disabled={status === "thinking"}
        error={error}
        onSubmit={sendMessage}
      />
    </div>
  );
}
