import { useEffect, useRef } from "react";

import { THEME_ATTRIBUTE } from "@/config/theme";
import { startViewTransition } from "@/lib/view-transition";
import { useCurrentTheme } from "@/store/theme";

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
