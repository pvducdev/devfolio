import { Dog } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import ButtonWithTooltip from "@/components/common/button-with-tooltip.tsx";
import { Kbd, KbdGroup } from "@/components/ui/kbd.tsx";
import { SITE_CONFIG } from "@/config/site.ts";
import { assistant_tooltip } from "@/paraglide/messages.js";
import { useAppLayoutActions } from "@/store/app-layout.ts";

const KBD = "j";

export default function AssistantTrigger() {
  const { togglePanel } = useAppLayoutActions();

  const onToggleAssistant = () => {
    togglePanel("assistant");
  };

  useHotkeys(`mod+${KBD}`, onToggleAssistant);

  return (
    <ButtonWithTooltip
      className="size-7"
      onClick={onToggleAssistant}
      size="icon"
      tooltip={
        <div className="flex items-center space-x-2">
          <span>{assistant_tooltip({ name: SITE_CONFIG.assistant.name })}</span>
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
