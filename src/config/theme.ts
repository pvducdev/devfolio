import { STORE_KEYS } from "./store-keys";

export const THEME_STORAGE_KEY = STORE_KEYS.THEME;
export const THEME_ATTRIBUTE = "data-theme";
export const DEFAULT_THEME = "default";

export const THEMES = [
  {
    name: "Notebook (default)",
    value: "default",
  },
  {
    name: "Bubblegum",
    value: "bubblegum",
  },
  {
    name: "Dark Twitter",
    value: "twitter",
  },
  {
    name: "Mocha Mousse",
    value: "mocha-mousse",
  },
];

export type Theme = (typeof THEMES)[number];
