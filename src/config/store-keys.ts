export const STORE_KEYS = {
  ASSISTANT: "assistant",
  APP_LAYOUT: "app-layout",
  TABS: "tabs",
  THEME: "theme",
} as const;

export type StoreKey = (typeof STORE_KEYS)[keyof typeof STORE_KEYS];
