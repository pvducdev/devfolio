import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { getLocale, locales, setLocale } from "@/paraglide/runtime.js";

const localeLabels: Record<string, string> = {
  en: "EN",
  vi: "VI",
};

export function LanguageSwitcher() {
  const currentLocale = getLocale();

  return (
    <Tabs
      onValueChange={(value) => setLocale(value as (typeof locales)[number])}
      value={currentLocale}
    >
      <TabsList className="h-7 w-full">
        {locales.map((locale) => (
          <TabsTrigger className="px-2 text-xs" key={locale} value={locale}>
            {localeLabels[locale] ?? locale.toUpperCase()}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
