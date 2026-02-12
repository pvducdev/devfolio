import { Button } from "@/components/ui/button";
import { DOCK_BUTTONS } from "@/config/mobile-dock";
import type { MobileRouteId } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { DockButton } from "@/types/mobile";

interface CommandDockProps {
  routeId: MobileRouteId;
  isTyping: boolean;
  onButtonTap: (button: DockButton) => void;
}

export default function CommandDock({
  routeId,
  isTyping,
  onButtonTap,
}: CommandDockProps) {
  const config = DOCK_BUTTONS[routeId];

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-dashed bg-transparent pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center gap-2 px-3 py-2">
        {config.buttons.map((button) => (
          <Button
            className={cn(
              "min-h-10 flex-1 border-dashed font-mono text-xs uppercase",
              "transition-colors duration-60 active:bg-foreground active:text-background",
              isTyping && "opacity-40"
            )}
            disabled={isTyping}
            key={button.id}
            onClick={() => onButtonTap(button)}
            variant="outline"
          >
            {button.label()}
          </Button>
        ))}
      </div>
    </div>
  );
}
