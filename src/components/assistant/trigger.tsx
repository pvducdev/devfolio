import { Dog } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import ButtonWithTooltip from "@/components/common/button-with-tooltip";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { SITE_CONFIG } from "@/config/site";
import { getDisplayKeys, getHotkeyCombo } from "@/lib/hotkeys";
import { assistant_tooltip } from "@/paraglide/messages.js";
import { useAppLayoutActions } from "@/store/app-layout";

export default function AssistantTrigger() {
  const { togglePanel } = useAppLayoutActions();

  const onToggleAssistant = () => {
    togglePanel("assistant");
  };

  useHotkeys(getHotkeyCombo("assistant"), onToggleAssistant);

  return (
    <ButtonWithTooltip
      className="size-7"
      onClick={onToggleAssistant}
      size="icon"
      tooltip={
        <div className="flex items-center space-x-2">
          <span>{assistant_tooltip({ name: SITE_CONFIG.assistant.name })}</span>
          <KbdGroup>
            {getDisplayKeys("assistant").map((key) => (
              <Kbd key={key}>{key}</Kbd>
            ))}
          </KbdGroup>
        </div>
      }
      variant="ghost"
    >
      <Dog />
    </ButtonWithTooltip>
  );
}
