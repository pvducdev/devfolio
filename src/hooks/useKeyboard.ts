import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";

type KeyMatcher = string | string[] | ((event: KeyboardEvent) => boolean);

type KeyboardEventType = "keydown" | "keyup" | "keypress";

interface Modifiers {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

interface BaseOptions {
  target?: Window | Document | HTMLElement | null;
  eventType?: KeyboardEventType;
  enabled?: boolean;
}

interface EventBehaviorOptions {
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

interface FilterOptions {
  ignoreElements?: string[];
  onlyFromElements?: string[];
}

interface ModifierOptions {
  modifiers?: Modifiers;
  strictModifiers?: boolean;
}

type UseKeyPressOptions = BaseOptions &
  EventBehaviorOptions &
  FilterOptions &
  ModifierOptions;

type KeyPressHandler = (event: KeyboardEvent) => void;

const DEFAULT_IGNORE_ELEMENTS = ["INPUT", "TEXTAREA", "SELECT"];

const getDefaultTarget = () => (typeof window !== "undefined" ? window : null);

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
  strict: boolean = true,
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

type ProcessedMatcher =
  | { type: "function"; fn: (e: KeyboardEvent) => boolean }
  | { type: "string"; key: string }
  | { type: "array"; keys: string[] };

function processMatcher(keyMatcher: KeyMatcher): ProcessedMatcher {
  if (typeof keyMatcher === "function") {
    return { type: "function", fn: keyMatcher };
  }
  if (typeof keyMatcher === "string") {
    return { type: "string", key: keyMatcher };
  }
  return { type: "array", keys: keyMatcher };
}

function keyMatches(event: KeyboardEvent, matcher: ProcessedMatcher): boolean {
  if (matcher.type === "function") {
    return matcher.fn(event);
  }

  if (matcher.type === "string") {
    return event.key === matcher.key || event.code === matcher.key;
  }

  for (let i = 0; i < matcher.keys.length; i++) {
    const key = matcher.keys[i];
    if (event.key === key || event.code === key) {
      return true;
    }
  }
  return false;
}

export function useKeyPress(
  keyMatcher: KeyMatcher,
  handler: KeyPressHandler,
  options: UseKeyPressOptions = {},
): void {
  const {
    target = getDefaultTarget(),
    eventType = "keydown",
    enabled = true,
    preventDefault = false,
    stopPropagation = false,
    modifiers,
    strictModifiers = true,
    ignoreElements,
    onlyFromElements,
  } = options;

  const processedMatcher = useMemo(
    () => processMatcher(keyMatcher),
    [keyMatcher],
  );

  const configRef = useRef({
    modifiers,
    strictModifiers,
    ignoreElements,
    onlyFromElements,
    preventDefault,
    stopPropagation,
  });

  useEffect(() => {
    configRef.current = {
      modifiers,
      strictModifiers,
      ignoreElements,
      onlyFromElements,
      preventDefault,
      stopPropagation,
    };
  });

  const onKeyPress = useEffectEvent((event: KeyboardEvent) => {
    const config = configRef.current;

    if (target && isGlobalTarget(target)) {
      if (
        shouldIgnoreEvent(event, config.ignoreElements, config.onlyFromElements)
      ) {
        return;
      }
    }

    if (!modifiersMatch(event, config.modifiers, config.strictModifiers)) {
      return;
    }

    if (!keyMatches(event, processedMatcher)) {
      return;
    }

    if (config.preventDefault) {
      event.preventDefault();
    }
    if (config.stopPropagation) {
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

export type {
  KeyMatcher,
  KeyboardEventType,
  Modifiers,
  BaseOptions,
  EventBehaviorOptions,
  FilterOptions,
  ModifierOptions,
  UseKeyPressOptions,
  KeyPressHandler,
};
