import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ui_lang_en, ui_lang_vi } from "@/paraglide/messages.js";
import type { Locale } from "@/paraglide/runtime.js";
import { getLocale, locales, setLocale } from "@/paraglide/runtime.js";

const localeLabels: Record<Locale, () => string> = {
  en: ui_lang_en,
  vi: ui_lang_vi,
};

export default function LanguageSwitcher() {
  const currentLocale = getLocale();

  return (
    <Tabs onValueChange={(value) => setLocale(value)} value={currentLocale}>
      <TabsList className="h-7 w-full">
        {locales.map((locale) => (
          <TabsTrigger className="px-2 text-xs" key={locale} value={locale}>
            {localeLabels[locale]()}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
