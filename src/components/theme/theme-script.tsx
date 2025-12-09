import { useLayoutEffect } from "react";
import { useCurrentTheme } from "@/store/theme.ts";

export default function ThemeScript() {
  const theme = useCurrentTheme();

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // biome-ignore lint/complexity/noUselessFragments: <custom>
  return <></>;
}
