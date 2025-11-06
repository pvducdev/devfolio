import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";

type KeyMatcher = string | string[] | ((event: KeyboardEvent) => boolean);

type KeyboardEventType = "keydown" | "keyup" | "keypress";

type Modifiers = {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
};

type BaseOptions = {
  target?: Window | Document | HTMLElement | null;
  eventType?: KeyboardEventType;
  enabled?: boolean;
};

type EventBehaviorOptions = {
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

type FilterOptions = {
  ignoreElements?: string[];
  onlyFromElements?: string[];
};

type ModifierOptions = {
  modifiers?: Modifiers;
  /**
   * When true (default), ALL modifiers must match exactly as specified.
   * When false, only specified modifiers are checked (others are ignored).
   *
   * @example
   * // Strict mode (default): Only Ctrl+S (no Shift, Alt, or Meta)
   * useKeyPress("s", handler, { modifiers: { ctrl: true }, strictModifiers: true })
   *
   * @example
   * // Non-strict mode: Ctrl+S, Ctrl+Shift+S, Ctrl+Alt+S all work
   * useKeyPress("s", handler, { modifiers: { ctrl: true }, strictModifiers: false })
   *
   * @default true
   */
  strictModifiers?: boolean;
};

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
  onlyFromElements?: string[]
): boolean {
  const target = event.target;

  // Type-safe check: only process HTML elements with tagName
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;

  if (onlyFromElements && onlyFromElements.length > 0) {
    return !onlyFromElements.includes(tagName);
  }

  const elementsToIgnore = ignoreElements ?? DEFAULT_IGNORE_ELEMENTS;
  return elementsToIgnore.includes(tagName);
}

function modifiersMatch(
  event: KeyboardEvent,
  modifiers?: Modifiers,
  strict = true
): boolean {
  if (!modifiers) {
    return true;
  }

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
  // Validate array matcher is not empty
  if (keyMatcher.length === 0) {
    throw new Error("Key matcher array cannot be empty");
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

  for (const key of matcher.keys) {
    if (event.key === key || event.code === key) {
      return true;
    }
  }
  return false;
}

/**
 * Hook for handling keyboard events with flexible matching and filtering options.
 *
 * @param keyMatcher - Key(s) to match: string, array of strings, or custom function
 * @param handler - Callback function to execute when key matches
 * @param options - Configuration options for event handling, modifiers, and filtering
 *
 * @example
 * // Simple key press
 * useKeyPress("Escape", () => closeModal())
 *
 * @example
 * // Multiple keys
 * useKeyPress(["Enter", "NumpadEnter"], () => submitForm())
 *
 * @example
 * // With modifiers (strict mode - only Ctrl+S, no other modifiers)
 * useKeyPress("s", handleSave, { modifiers: { ctrl: true } })
 *
 * @example
 * // Custom matching function
 * useKeyPress((e) => e.key >= "0" && e.key <= "9", handleNumberKey)
 *
 * @example
 * // Using with refs - CORRECT PATTERN (target updates when ref changes)
 * const inputRef = useRef<HTMLInputElement>(null);
 * useKeyPress("Enter", handleSubmit, {
 *   target: inputRef.current,  // ✅ Will re-subscribe when ref populates
 * });
 *
 * @example
 * // Using with callback refs - ALTERNATIVE PATTERN
 * const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);
 * useKeyPress("Enter", handleSubmit, {
 *   target: inputElement,  // ✅ State triggers re-subscription
 * });
 * <input ref={setInputElement} />
 */
export function useKeyPress(
  keyMatcher: KeyMatcher,
  handler: KeyPressHandler,
  options: UseKeyPressOptions = {}
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
    [keyMatcher]
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

    // Only filter by element when listening on global targets (window/document)
    // Element-specific listeners don't need element filtering
    const shouldFilterByElement =
      target &&
      isGlobalTarget(target) &&
      shouldIgnoreEvent(event, config.ignoreElements, config.onlyFromElements);

    if (shouldFilterByElement) {
      return;
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
    if (!(enabled && target)) {
      return;
    }

    const eventListener = (event: Event) => {
      onKeyPress(event as KeyboardEvent);
    };

    target.addEventListener(eventType, eventListener);

    return () => {
      target.removeEventListener(eventType, eventListener);
    };
    // Include target in dependencies so hook re-subscribes when target changes
    // This is important for refs that update after initial render
  }, [target, eventType, enabled, onKeyPress]);
}

/**
 * Hook that tracks whether a key is currently pressed (boolean state).
 * Returns true while the key is held down, false when released.
 *
 * @param keyMatcher - Key(s) to track: string, array of strings, or custom function
 * @param options - Configuration options (same as useKeyPress, except eventType)
 * @returns Boolean indicating whether the key is currently pressed
 *
 * @example
 * // Track if Shift key is pressed
 * const isShiftPressed = useKeyState("Shift")
 *
 * @example
 * // Track if Ctrl or Meta (Cmd) is pressed
 * const isModifierPressed = useKeyState(["Control", "Meta"])
 */
export function useKeyState(
  keyMatcher: KeyMatcher,
  options: Omit<UseKeyPressOptions, "eventType"> = {}
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

/**
 * Convenience hook for keyboard shortcuts with modifier keys.
 * Automatically enables preventDefault and strict modifier matching.
 *
 * @param key - Key to match (single key string)
 * @param handler - Callback function to execute when shortcut matches
 * @param modifiers - Required modifier keys (ctrl, shift, alt, meta)
 * @param options - Additional configuration options
 *
 * @example
 * // Ctrl+S to save
 * useKeyboardShortcut("s", handleSave, { ctrl: true })
 *
 * @example
 * // Ctrl+Shift+Z to redo
 * useKeyboardShortcut("z", handleRedo, { ctrl: true, shift: true })
 *
 * @example
 * // Cmd+K on Mac, Ctrl+K on Windows/Linux
 * useKeyboardShortcut("k", openCommandPalette, {
 *   [isMac ? "meta" : "ctrl"]: true
 * })
 */
export function useKeyboardShortcut(
  key: string,
  handler: KeyPressHandler,
  modifiers: Modifiers,
  options?: Omit<UseKeyPressOptions, "modifiers">
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
