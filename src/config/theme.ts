import { STORE_KEYS } from "./store-keys";

export const THEME_STORAGE_KEY = STORE_KEYS.THEME;
export const THEME_ATTRIBUTE = "data-theme";
export const DEFAULT_THEME = "default";

export const THEMES = [
  {
    name: "Notebook (default)",
    value: "default",
    fontUrl:
      "https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap",
  },
  {
    name: "Bubblegum",
    value: "bubblegum",
    fontUrl:
      "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Lora:wght@400;600&family=Poppins:wght@400;500;600;700&display=swap",
  },
  {
    name: "Dark Twitter",
    value: "twitter",
    fontUrl:
      "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap",
  },
  {
    name: "Mocha Mousse",
    value: "mocha-mousse",
    fontUrl:
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap",
  },
];

export const THEME_FONT_URLS: Record<string, string> = Object.fromEntries(
  THEMES.map((t) => [t.value, t.fontUrl])
);

export type Theme = (typeof THEMES)[number];
