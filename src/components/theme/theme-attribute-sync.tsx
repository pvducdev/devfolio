import { useEffect } from "react";

import { useCurrentTheme } from "@/components/theme/store";
import { THEME_ATTRIBUTE } from "@/config/theme";

import { startViewTransition } from "./view-transition";

export default function ThemeAttributeSync() {
  const theme = useCurrentTheme();

  useEffect(() => {
    if (document.documentElement.getAttribute(THEME_ATTRIBUTE) === theme) {
      return;
    }

    startViewTransition(() => {
      document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
    });
  }, [theme]);

  return null;
}
