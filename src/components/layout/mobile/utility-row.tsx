import { Button } from "@/components/ui/button.tsx";
import { SITE_CONFIG } from "@/config/site.ts";
import { THEMES } from "@/config/theme.ts";
import { cn } from "@/lib/utils.ts";
import { getLocale, locales, setLocale } from "@/paraglide/runtime";
import { useMobileShellStore } from "@/store/mobile-shell.ts";
import { useCurrentTheme, useSetTheme } from "@/store/theme.ts";

export const UtilityRow = ({
  onSettingsTap,
}: {
  onSettingsTap: () => void;
}) => {
  const theme = useCurrentTheme();
  const setTheme = useSetTheme();
  const currentLocale = getLocale();
  const openAssistant = useMobileShellStore((s) => s.openAssistant);

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
          onClick={() => setLocale(locale as (typeof locales)[number])}
          size="utility"
          variant="utility"
        >
          {locale}
        </Button>
      ))}

      <span className="text-[10px] text-muted-foreground/40">·</span>

      <Button
        className="ml-auto"
        onClick={() =>
          window.open(
            SITE_CONFIG.repository.url,
            "_blank",
            "noopener,noreferrer"
          )
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
