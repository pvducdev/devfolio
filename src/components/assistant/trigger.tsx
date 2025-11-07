import { Dog } from "lucide-react";
import ButtonWithTooltip from "@/components/common/button-with-tooltip.tsx";
import { Kbd, KbdGroup } from "@/components/ui/kbd.tsx";
import { useKeyboardShortcut } from "@/hooks/use-keyboard.ts";

const KBD = "j";

export default function AssistantTrigger() {
  const onToggleAssistant = () => {
    //
  };

  useKeyboardShortcut(KBD, onToggleAssistant, {
    meta: true,
  });

  return (
    <ButtonWithTooltip
      className="size-7"
      size="icon"
      tooltip={
        <div className="flex items-center space-x-2">
          <span>HeyD Assistant</span>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>{KBD.toUpperCase()}</Kbd>
          </KbdGroup>
        </div>
      }
      variant="ghost"
    >
      <Dog />
    </ButtonWithTooltip>
  );
}
