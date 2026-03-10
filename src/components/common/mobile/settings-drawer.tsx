import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { SITE_CONFIG } from "@/config/site";
import { THEMES } from "@/config/theme";
import { useGhostTyping } from "@/hooks/use-ghost-typing";
import { useRepoStars } from "@/hooks/use-repo-stars";
import { cn } from "@/lib/utils";
import {
  mobile_settings_assistant,
  mobile_settings_assistant_hint,
  mobile_settings_close,
  mobile_settings_language,
  mobile_settings_repo,
  mobile_settings_search,
  mobile_settings_search_hint,
  mobile_settings_theme,
  mobile_settings_title,
} from "@/paraglide/messages";
import { getLocale, locales, setLocale } from "@/paraglide/runtime.js";
import { useIsDrawerOpen, useMobileShellStore } from "@/store/mobile-shell";
import { useCurrentTheme, useSetTheme } from "@/store/theme";

export default function SettingsDrawer() {
  const isOpen = useIsDrawerOpen();
  const closeDrawer = useMobileShellStore((s) => s.closeDrawer);
  const theme = useCurrentTheme();
  const setThemeValue = useSetTheme();
  const stars = useRepoStars();
  const { text, isTyping, type } = useGhostTyping();
  const currentLocale = getLocale();

  const handleThemeChange = (value: string) => {
    type(`> theme --set ${value}`);
    setThemeValue(value);
  };

  const handleLocaleChange = (locale: string) => {
    type(`> lang --set ${locale}`);
    setLocale(locale as (typeof locales)[number]);
  };

  const handleRepoTap = () => {
    window.open(SITE_CONFIG.repository.url, "_blank", "noopener,noreferrer");
  };

  return (
    <Drawer
      onOpenChange={(open) => {
        if (!open) {
          closeDrawer();
        }
      }}
      open={isOpen}
    >
      <DrawerContent className="max-h-[50dvh] rounded-none border-t border-dashed bg-sidebar pb-[env(safe-area-inset-bottom)]">
        <DrawerTitle className="sr-only">{mobile_settings_title()}</DrawerTitle>
        <DrawerDescription className="sr-only">
          {mobile_settings_title()}
        </DrawerDescription>

        <div className="overflow-y-auto p-4 font-mono">
          <p className="text-muted-foreground text-xs">
            {">"} {mobile_settings_title()}
          </p>
          <div className="mt-2 border-t border-dashed" />

          <div className="mt-3 space-y-3">
            <SettingsRow label={mobile_settings_theme()}>
              <div className="flex gap-1">
                {THEMES.map((t) => (
                  <button
                    className={cn(
                      "flex-1 border border-dashed px-2 py-1.5 font-mono text-xs uppercase",
                      theme === t.value
                        ? "bg-foreground text-background"
                        : "text-muted-foreground"
                    )}
                    key={t.value}
                    onClick={() => handleThemeChange(t.value)}
                    type="button"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </SettingsRow>

            <SettingsRow label={mobile_settings_language()}>
              <div className="flex gap-1">
                {locales.map((locale) => (
                  <button
                    className={cn(
                      "flex-1 border border-dashed px-2 py-1.5 font-mono text-xs uppercase",
                      currentLocale === locale
                        ? "bg-foreground text-background"
                        : "text-muted-foreground"
                    )}
                    key={locale}
                    onClick={() => handleLocaleChange(locale)}
                    type="button"
                  >
                    {locale}
                  </button>
                ))}
              </div>
            </SettingsRow>

            <div className="border-t border-dashed" />

            <div className="space-y-2 opacity-50">
              <SettingsRow label={mobile_settings_search()}>
                <span className="text-muted-foreground text-xs">
                  {mobile_settings_search_hint()}
                </span>
              </SettingsRow>

              <SettingsRow label={mobile_settings_assistant()}>
                <span className="text-muted-foreground text-xs">
                  {mobile_settings_assistant_hint()}
                </span>
              </SettingsRow>
            </div>

            <div className="border-t border-dashed" />

            <button
              className="flex w-full items-center justify-between py-1 text-left"
              onClick={handleRepoTap}
              type="button"
            >
              <span className="text-foreground text-xs">
                {">"} {mobile_settings_repo()}
              </span>
              {stars > 0 && (
                <span className="text-muted-foreground text-xs">
                  {stars} stars
                </span>
              )}
            </button>

            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground text-xs">
                v{SITE_CONFIG.version}
              </span>
            </div>

            <div className="border-t border-dashed" />

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">$</span>
              <span className="text-foreground">{text}</span>
              {isTyping && (
                <span className="inline-block h-3 w-0.5 animate-pulse bg-foreground" />
              )}
            </div>

            <div className="flex justify-end">
              <DrawerClose asChild>
                <Button
                  className="min-h-10 border-dashed font-mono text-xs uppercase transition-colors duration-60 active:bg-foreground active:text-background"
                  variant="outline"
                >
                  {mobile_settings_close()}
                </Button>
              </DrawerClose>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function SettingsRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-muted-foreground text-xs">
        {">"} {label}
      </span>
      {children}
    </div>
  );
}
