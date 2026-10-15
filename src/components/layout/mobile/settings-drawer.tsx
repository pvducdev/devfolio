import { cn } from "cn";

import {
  useIsDrawerOpen,
  useMobileShellActions,
} from "@/components/layout/mobile/store";
import { useGhostTyping } from "@/components/layout/mobile/use-ghost-typing";
import { useRepoStars } from "@/components/layout/use-repo-stars";
import { useCurrentTheme, useSetTheme } from "@/components/theme/store";
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
import type { ThemeValue } from "@/config/theme";
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

type Locale = (typeof locales)[number];

const buildChoiceClassName = (isSelected: boolean) =>
  cn(
    "flex-1 border border-dashed px-2 py-1.5 font-mono text-xs uppercase",
    isSelected ? "bg-foreground text-background" : "text-muted-foreground"
  );

const SettingsRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <span className="text-muted-foreground text-xs">
      {">"} {label}
    </span>
    {children}
  </div>
);

const SettingsDrawer = () => {
  const isOpen = useIsDrawerOpen();
  const { closeDrawer, openAssistant } = useMobileShellActions();
  const theme = useCurrentTheme();
  const setThemeValue = useSetTheme();
  const stars = useRepoStars();
  const { text, isTyping, type } = useGhostTyping();
  const currentLocale = getLocale();

  const handleThemeChange = (value: ThemeValue) => {
    type(`> theme --set ${value}`);
    setThemeValue(value);
  };

  const handleLocaleChange = (locale: Locale) => {
    type(`> lang --set ${locale}`);
    setLocale(locale);
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
      <DrawerContent className="max-h-[50dvh] rounded-none border-t data-[swipe-direction=down]:rounded-none border-dashed bg-sidebar pb-[env(safe-area-inset-bottom)]">
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
                    className={buildChoiceClassName(theme === t.value)}
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
                    className={buildChoiceClassName(currentLocale === locale)}
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
            </div>

            <button
              className="w-full space-y-1.5 text-left"
              onClick={openAssistant}
              type="button"
            >
              <span className="text-muted-foreground text-xs">
                {">"} {mobile_settings_assistant()}
              </span>
              <p className="text-muted-foreground text-xs">
                {mobile_settings_assistant_hint()}
              </p>
            </button>

            <div className="border-t border-dashed" />

            <a
              className="flex w-full items-center justify-between py-1 text-left"
              href={SITE_CONFIG.repository.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="text-foreground text-xs">
                {">"} {mobile_settings_repo()}
              </span>
              {stars !== null && (
                <span className="text-muted-foreground text-xs">
                  {stars} stars
                </span>
              )}
            </a>

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
              <DrawerClose
                render={
                  <Button
                    className="min-h-10 border-dashed font-mono text-xs uppercase transition-colors duration-60 active:bg-foreground active:text-background"
                    variant="outline"
                  />
                }
              >
                {mobile_settings_close()}
              </DrawerClose>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SettingsDrawer;
