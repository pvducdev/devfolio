import { cn } from "cn";

import { useMobileShellActions } from "@/components/layout/mobile/store";
import { useCurrentTheme, useSetTheme } from "@/components/theme/store";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/config/site";
import { THEMES } from "@/config/theme";
import { getLocale, locales, setLocale } from "@/paraglide/runtime";

export const UtilityRow = ({
  onSettingsTap,
}: {
  onSettingsTap: () => void;
}) => {
  const theme = useCurrentTheme();
  const setTheme = useSetTheme();
  const currentLocale = getLocale();
  const { openAssistant } = useMobileShellActions();

  return (
    <div className="flex items-center gap-1.5 border-b border-dashed px-3 py-2">
      {THEMES.map((t) => (
        <Button
          className={cn(theme === t.value && "bg-foreground text-background")}
          key={t.value}
          onClick={() => setTheme(t.value)}
          size="utility"
          variant="utility"
        >
          {t.shortName}
        </Button>
      ))}

      <span className="text-[10px] text-muted-foreground/40">·</span>

      {locales.map((locale) => (
        <Button
          className={cn(
            currentLocale === locale && "bg-foreground text-background"
          )}
          key={locale}
          onClick={() => setLocale(locale)}
          size="utility"
          variant="utility"
        >
          {locale}
        </Button>
      ))}

      <span className="text-[10px] text-muted-foreground/40">·</span>

      <Button
        className="ml-auto"
        nativeButton={false}
        render={
          <a
            href={SITE_CONFIG.repository.url}
            rel="noopener noreferrer"
            target="_blank"
          />
        }
        size="utility"
        variant="utility"
      >
        ★
      </Button>

      <Button onClick={openAssistant} size="utility" variant="utility">
        ?
      </Button>

      <Button onClick={onSettingsTap} size="utility" variant="utility">
        #
      </Button>
    </div>
  );
};
