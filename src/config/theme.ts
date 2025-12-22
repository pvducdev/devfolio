import { STORE_KEYS } from "./store-keys";

export const THEME_STORAGE_KEY = STORE_KEYS.THEME;
export const THEME_ATTRIBUTE = "data-theme";
export const DEFAULT_THEME = "default";

export const THEMES = [
  {
    name: "C x J (default)",
    value: "default",
    fontUrl:
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap",
  },
  {
    name: "Mono",
    value: "mono",
    fontUrl:
      "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap",
  },
  {
    name: "Notebook",
    value: "notebook",
    fontUrl:
      "https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Fira+Code:wght@300..700&display=swap",
  },
];

export const THEME_FONT_URLS: Record<string, string> = Object.fromEntries(
  THEMES.map((t) => [t.value, t.fontUrl])
);

export type Theme = (typeof THEMES)[number];
