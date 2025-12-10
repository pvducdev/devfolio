import { useEffect } from "react";
import { THEME_ATTRIBUTE } from "@/config/theme.ts";
import { useCurrentTheme } from "@/store/theme.ts";

export default function ThemeScript() {
  const theme = useCurrentTheme();

  useEffect(() => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  }, [theme]);

  return null;
}
