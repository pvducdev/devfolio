import MobileAssistantContent from "@/components/assistant/mobile/content";
import MobileAssistantFooter from "@/components/assistant/mobile/footer";
import MobileAssistantHeader from "@/components/assistant/mobile/header";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useAssistant } from "@/hooks/use-assistant";
import {
  assistant_header,
  assistant_suggest1,
  assistant_suggest2,
  assistant_suggest3,
} from "@/paraglide/messages.js";
import { useIsAssistantOpen, useMobileShellStore } from "@/store/mobile-shell";

export default function MobileAssistantDrawer() {
  const isOpen = useIsAssistantOpen();
  const closeAssistant = useMobileShellStore((s) => s.closeAssistant);
  const { commands, message, hasMessage, status, error, sendMessage } =
    useAssistant();

  return (
    <Drawer
      onOpenChange={(open) => {
        if (!open) {
          closeAssistant();
        }
      }}
      open={isOpen}
    >
      <DrawerContent className="h-dvh max-h-dvh rounded-none border-t border-dashed bg-background">
        <DrawerTitle className="sr-only">{assistant_header()}</DrawerTitle>
        <DrawerDescription className="sr-only">
          {assistant_header()}
        </DrawerDescription>

        <div className="grid h-full grid-rows-[auto_1fr_auto]">
          <MobileAssistantHeader onClose={closeAssistant} />
          <MobileAssistantContent
            hasMessage={hasMessage}
            message={message}
            onSuggestionClick={sendMessage}
            status={status}
            suggestions={[
              assistant_suggest1(),
              assistant_suggest2(),
              assistant_suggest3(),
            ]}
          />
          <MobileAssistantFooter
            commands={commands}
            disabled={status === "thinking"}
            error={error}
            onSubmit={sendMessage}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
