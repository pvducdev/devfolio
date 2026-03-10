import { Button } from "@/components/ui/button";
import { DOCK_BUTTONS } from "@/config/mobile-dock";
import type { MobileRouteId } from "@/config/routes";
import { SITE_CONFIG } from "@/config/site";
import { THEMES } from "@/config/theme";
import { cn } from "@/lib/utils";
import { getLocale, locales, setLocale } from "@/paraglide/runtime.js";
import { useMobileShellStore } from "@/store/mobile-shell";
import { useCurrentTheme, useSetTheme } from "@/store/theme";
import type { DockButton } from "@/types/mobile";

const THEME_SHORT: Record<string, string> = {
  default: "C×J",
  mono: "MONO",
  notebook: "NB",
};

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
            "absolute bottom-full left-1/2 mb-[-1px] -translate-x-1/2",
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

const UTIL_BTN =
  "border border-dashed px-2 py-1.5 font-mono text-[10px] uppercase transition-colors duration-100 active:bg-foreground active:text-background";

function UtilityRow({ onSettingsTap }: { onSettingsTap: () => void }) {
  const theme = useCurrentTheme();
  const setTheme = useSetTheme();
  const currentLocale = getLocale();

  return (
    <div className="flex items-center gap-1.5 border-b border-dashed px-3 py-2">
      {THEMES.map((t) => (
        <button
          className={cn(
            UTIL_BTN,
            theme === t.value
              ? "bg-foreground text-background"
              : "text-muted-foreground"
          )}
          key={t.value}
          onClick={() => setTheme(t.value)}
          type="button"
        >
          {THEME_SHORT[t.value] ?? t.value}
        </button>
      ))}

      <span className="text-[10px] text-muted-foreground/40">·</span>

      {locales.map((locale) => (
        <button
          className={cn(
            UTIL_BTN,
            currentLocale === locale
              ? "bg-foreground text-background"
              : "text-muted-foreground"
          )}
          key={locale}
          onClick={() => setLocale(locale as (typeof locales)[number])}
          type="button"
        >
          {locale}
        </button>
      ))}

      <span className="text-[10px] text-muted-foreground/40">·</span>

      <button
        className={cn(UTIL_BTN, "ml-auto text-muted-foreground")}
        onClick={() =>
          window.open(
            SITE_CONFIG.repository.url,
            "_blank",
            "noopener,noreferrer"
          )
        }
        type="button"
      >
        ★
      </button>

      <button
        className={cn(UTIL_BTN, "text-muted-foreground")}
        onClick={onSettingsTap}
        type="button"
      >
        #
      </button>
    </div>
  );
}
