import MobileAssistantContent from "@/components/assistant/mobile/content";
import MobileAssistantFooter from "@/components/assistant/mobile/footer";
import MobileAssistantHeader from "@/components/assistant/mobile/header";
import { useAssistant } from "@/components/assistant/use-assistant";
import {
  useIsAssistantOpen,
  useMobileShellActions,
} from "@/components/layout/mobile/store";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { assistant_header } from "@/paraglide/messages.js";

export default function MobileAssistantDrawer() {
  const isOpen = useIsAssistantOpen();
  const { closeAssistant } = useMobileShellActions();
  const { message, status, error, sendMessage } = useAssistant();

  return (
    <Drawer
      onOpenChange={(open) => {
        if (!open) {
          closeAssistant();
        }
      }}
      open={isOpen}
    >
      <DrawerContent className="h-dvh max-h-dvh rounded-none border-t data-[swipe-direction=down]:rounded-none border-dashed bg-background">
        <DrawerTitle className="sr-only">{assistant_header()}</DrawerTitle>
        <DrawerDescription className="sr-only">
          {assistant_header()}
        </DrawerDescription>

        <div className="grid h-full grid-rows-[auto_1fr_auto]">
          <MobileAssistantHeader onClose={closeAssistant} />
          <MobileAssistantContent
            message={message}
            onSuggestionClick={sendMessage}
            status={status}
          />
          <MobileAssistantFooter
            disabled={status === "thinking"}
            error={error}
            onSubmit={sendMessage}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
