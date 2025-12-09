import { useLayoutEffect } from "react";
import { useThemeStore } from "@/store/theme.ts";

export default function ThemeScript() {
  const theme = useThemeStore((state) => state.theme);

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // biome-ignore lint/complexity/noUselessFragments: <custom>
  return <></>;
}
