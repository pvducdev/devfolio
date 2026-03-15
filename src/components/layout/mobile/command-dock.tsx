import { UtilityRow } from "@/components/layout/mobile/utility-row.tsx";
import { Button } from "@/components/ui/button";
import { DOCK_BUTTONS } from "@/config/mobile-dock";
import type { MobileRouteId } from "@/config/routes";
import { cn } from "@/lib/utils";
import { useMobileShellStore } from "@/store/mobile-shell";
import type { DockButton } from "@/types/mobile";

interface CommandDockProps {
  routeId: MobileRouteId;
  isTyping: boolean;
  onButtonTap: (button: DockButton) => void;
  onSettingsTap: () => void;
}

export default function CommandDock({
  routeId,
  isTyping,
  onButtonTap,
  onSettingsTap,
}: CommandDockProps) {
  const config = DOCK_BUTTONS[routeId];
  const isExpanded = useMobileShellStore((s) => s.isDockExpanded);
  const toggleDock = useMobileShellStore((s) => s.toggleDockExpanded);
  const collapseDock = useMobileShellStore((s) => s.collapseDock);

  const handleButtonTap = (button: DockButton) => {
    collapseDock();
    onButtonTap(button);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="relative">
        <button
          className={cn(
            "absolute bottom-full left-1/2 -mb-px -translate-x-1/2",
            "rounded-t-sm border border-b-0 border-dashed bg-background",
            "px-5 py-1 font-mono text-[10px] text-muted-foreground tracking-widest",
            "transition-colors duration-100 active:bg-foreground active:text-background"
          )}
          onClick={toggleDock}
          type="button"
        >
          {isExpanded ? "_ _ _" : "· · ·"}
        </button>

        <div className="border-t border-dashed bg-background">
          <div
            className="grid transition-[grid-template-rows] duration-200 ease-out"
            style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <UtilityRow onSettingsTap={onSettingsTap} />
            </div>
          </div>

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
                onClick={() => handleButtonTap(button)}
                variant="outline"
              >
                {button.label()}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
