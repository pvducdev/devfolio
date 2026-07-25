const HOTKEYS = {
  assistant: ["mod", "j"],
  closeAllTabs: ["alt", "shift", "w"],
  closeTab: ["alt", "w"],
  search: ["mod", "k"],
  showShortcuts: ["mod", "alt", "k"],
  toggleLayout: ["mod", "shift", "f"],
} as const satisfies Record<string, readonly string[]>;

type HotkeyId = keyof typeof HOTKEYS;

const HOTKEY_GROUPS = {
  general: ["search", "assistant", "toggleLayout", "showShortcuts"],
  tabs: ["closeTab", "closeAllTabs"],
} as const satisfies Record<string, readonly HotkeyId[]>;

type HotkeyGroupId = keyof typeof HOTKEY_GROUPS;

export { HOTKEYS, HOTKEY_GROUPS };
export type { HotkeyId, HotkeyGroupId };
