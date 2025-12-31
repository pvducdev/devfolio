const HOTKEYS = {
  search: ["mod", "k"],
  assistant: ["mod", "j"],
  toggleLayout: ["mod", "shift", "f"],
  showShortcuts: ["mod", "alt", "k"],
  closeTab: ["alt", "w"],
  closeAllTabs: ["alt", "shift", "w"],
} as const satisfies Record<string, readonly string[]>;

type HotkeyId = keyof typeof HOTKEYS;

const HOTKEY_GROUPS = {
  general: ["search", "assistant", "toggleLayout", "showShortcuts"],
  tabs: ["closeTab", "closeAllTabs"],
} as const satisfies Record<string, readonly HotkeyId[]>;

type HotkeyGroupId = keyof typeof HOTKEY_GROUPS;

export { HOTKEYS, HOTKEY_GROUPS };
export type { HotkeyId, HotkeyGroupId };
