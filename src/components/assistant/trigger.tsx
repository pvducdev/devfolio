import { Dog } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import ButtonWithTooltip from "@/components/common/button-with-tooltip.tsx";
import { Kbd, KbdGroup } from "@/components/ui/kbd.tsx";
import { useKeyboardShortcut } from "@/hooks/use-keyboard.ts";
import { useAppLayoutStore } from "@/store/app-layout.ts";

const KBD = "j";

export default function AssistantTrigger() {
  const [togglePanel] = useAppLayoutStore(
    useShallow((state) => [state.togglePanel])
  );

  const onToggleAssistant = () => {
    togglePanel("assistant");
  };

  useKeyboardShortcut(KBD, onToggleAssistant, {
    meta: true,
  });

  return (
    <ButtonWithTooltip
      className="size-7"
      onClick={onToggleAssistant}
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
