import { useEffect, useRef } from "react";
import { THEME_ATTRIBUTE } from "@/config/theme.ts";
import { startViewTransition } from "@/lib/view-transition.ts";
import { useCurrentTheme } from "@/store/theme.ts";

export default function ThemeScript() {
  const theme = useCurrentTheme();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const updateTheme = () => {
      document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
    };

    if (isFirstRender.current) {
      updateTheme();
      isFirstRender.current = false;
    } else {
      startViewTransition(updateTheme);
    }
  }, [theme]);

  return null;
}
