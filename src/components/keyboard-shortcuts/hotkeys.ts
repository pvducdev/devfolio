const HOTKEYS = {
  assistant: ["mod", "j"],
  closeAllTabs: ["alt", "shift", "w"],
  closeTab: ["alt", "w"],
  search: ["mod", "k"],
  showShortcuts: ["mod", "alt", "k"],
  toggleLayout: ["mod", "shift", "f"],
} as const satisfies Record<string, readonly string[]>;

export type HotkeyId = keyof typeof HOTKEYS;

export const HOTKEY_GROUPS = {
  general: ["search", "assistant", "toggleLayout", "showShortcuts"],
  tabs: ["closeTab", "closeAllTabs"],
} as const satisfies Record<string, readonly HotkeyId[]>;

const KEY_SYMBOLS = {
  alt: "⌥",
  ctrl: "⌃",
  mod: "⌘",
  shift: "⇧",
} as const;

type ModifierKey = keyof typeof KEY_SYMBOLS;

const isModifier = (key: string): key is ModifierKey => key in KEY_SYMBOLS;

export const getHotkeyCombo = (id: HotkeyId): string => HOTKEYS[id].join("+");

export const getDisplayKeys = (id: HotkeyId): string[] =>
  HOTKEYS[id].map((key) =>
    isModifier(key) ? KEY_SYMBOLS[key] : key.toUpperCase()
  );
