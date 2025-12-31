import { HOTKEYS, type HotkeyId } from "@/config/hotkeys";

const KEY_SYMBOLS = {
  mod: "⌘",
  alt: "⌥",
  shift: "⇧",
  ctrl: "⌃",
} as const;

type ModifierKey = keyof typeof KEY_SYMBOLS;

export function getHotkeyCombo(id: HotkeyId): string {
  return HOTKEYS[id].join("+");
}

export function getDisplayKeys(id: HotkeyId): string[] {
  return HOTKEYS[id].map((key) =>
    isModifier(key) ? KEY_SYMBOLS[key] : key.toUpperCase()
  );
}

function isModifier(key: string): key is ModifierKey {
  return key in KEY_SYMBOLS;
}
