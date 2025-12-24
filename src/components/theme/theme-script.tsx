import { useEffect, useRef } from "react";
import { THEME_ATTRIBUTE } from "@/config/theme.ts";
import { startViewTransition } from "@/lib/view-transition.ts";
import { useCurrentTheme } from "@/store/theme.ts";

export default function ThemeScript() {
  const theme = useCurrentTheme();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    startViewTransition(() => {
      document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
    });
  }, [theme]);

  return null;
}
