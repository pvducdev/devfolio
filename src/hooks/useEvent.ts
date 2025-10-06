import {useEffect, useEffectEvent, useState} from "react";

type KeyMatcher = string | string[] | ((event: KeyboardEvent) => boolean);

type KeyboardEventType = "keydown" | "keyup" | "keypress";

interface Modifiers {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

interface UseKeyPressOptions {
  target?: Window | Document | HTMLElement | null;
  eventType?: KeyboardEventType;
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  modifiers?: Modifiers;
  strictModifiers?: boolean;
  ignoreElements?: string[];
  onlyFromElements?: string[];
}

type KeyPressHandler = (event: KeyboardEvent) => void;

const DEFAULT_IGNORE_ELEMENTS = ["INPUT", "TEXTAREA", "SELECT"];

function isGlobalTarget(target: unknown): boolean {
  return target === window || target === document;
}

function shouldIgnoreEvent(
  event: KeyboardEvent,
  ignoreElements?: string[],
  onlyFromElements?: string[],
): boolean {
  const target = event.target as HTMLElement;
  const tagName = target?.tagName;

  if (!tagName) return false;

  if (onlyFromElements && onlyFromElements.length > 0) {
    return !onlyFromElements.includes(tagName);
  }

  const elementsToIgnore = ignoreElements ?? DEFAULT_IGNORE_ELEMENTS;
  return elementsToIgnore.includes(tagName);
}

function modifiersMatch(
  event: KeyboardEvent,
  modifiers?: Modifiers,
  strict = true,
): boolean {
  if (!modifiers) return true;

  const { ctrl, shift, alt, meta } = modifiers;

  if (strict) {
    return (
      event.ctrlKey === (ctrl ?? false) &&
      event.shiftKey === (shift ?? false) &&
      event.altKey === (alt ?? false) &&
      event.metaKey === (meta ?? false)
    );
  }

  return (
    (ctrl === undefined || event.ctrlKey === ctrl) &&
    (shift === undefined || event.shiftKey === shift) &&
    (alt === undefined || event.altKey === alt) &&
    (meta === undefined || event.metaKey === meta)
  );
}

function keyMatches(event: KeyboardEvent, keyMatcher: KeyMatcher): boolean {
  if (typeof keyMatcher === "function") {
    return keyMatcher(event);
  }

  if (typeof keyMatcher === "string") {
    return event.key === keyMatcher || event.code === keyMatcher;
  }

  if (Array.isArray(keyMatcher)) {
    return keyMatcher.some((key) => event.key === key || event.code === key);
  }

  return false;
}

export function useKeyPress(
  keyMatcher: KeyMatcher,
  handler: KeyPressHandler,
  options: UseKeyPressOptions = {},
): void {
  const {
    target = typeof window !== "undefined" ? window : null,
    eventType = "keydown",
    enabled = true,
    preventDefault = false,
    stopPropagation = false,
    modifiers,
    strictModifiers = true,
    ignoreElements,
    onlyFromElements,
  } = options;

  const onKeyPress = useEffectEvent((event: KeyboardEvent) => {
    if (target && isGlobalTarget(target)) {
      if (shouldIgnoreEvent(event, ignoreElements, onlyFromElements)) {
        return;
      }
    }

    if (!modifiersMatch(event, modifiers, strictModifiers)) {
      return;
    }

    if (!keyMatches(event, keyMatcher)) {
      return;
    }

    if (preventDefault) {
      event.preventDefault();
    }
    if (stopPropagation) {
      event.stopPropagation();
    }

    handler(event);
  });

  useEffect(() => {
    if (!enabled || !target) {
      return;
    }

    const eventListener = (event: Event) => {
      onKeyPress(event as KeyboardEvent);
    };

    target.addEventListener(eventType, eventListener);

    return () => {
      target.removeEventListener(eventType, eventListener);
    };
  }, [target, eventType, enabled, onKeyPress]);
}

export function useKeyState(
  keyMatcher: KeyMatcher,
  options: Omit<UseKeyPressOptions, "eventType"> = {},
): boolean {
  const [isPressed, setIsPressed] = useState(false);

  useKeyPress(keyMatcher, () => setIsPressed(true), {
    ...options,
    eventType: "keydown",
  });

  useKeyPress(keyMatcher, () => setIsPressed(false), {
    ...options,
    eventType: "keyup",
  });

  return isPressed;
}

export function useKeyboardShortcut(
  key: string,
  handler: KeyPressHandler,
  modifiers: Modifiers,
  options?: Omit<UseKeyPressOptions, "modifiers">,
): void {
  useKeyPress(key, handler, {
    ...options,
    modifiers,
    preventDefault: options?.preventDefault ?? true,
    strictModifiers: options?.strictModifiers ?? true,
  });
}
