import { createClientOnlyFn } from "@tanstack/react-start";
import type { Theme } from "@/config/theme.ts";

const applyTheme = createClientOnlyFn((theme: Theme["value"]) => {
  document.documentElement.setAttribute("data-theme", theme);
});

export default applyTheme;
