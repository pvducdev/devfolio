import { HOTKEYS } from "@/config/hotkeys";
import type { HotkeyId } from "@/config/hotkeys";

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
