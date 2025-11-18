import {
  type RefObject,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";

// ═══════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════

type KeyPredicate = (event: KeyboardEvent) => boolean;

type KeyMatcher =
  | string // Single key
  | string[] // Multiple keys (OR)
  | KeyPredicate; // Custom function

type KeyboardEventType = "keydown" | "keyup" | "keypress";

type ModifierKey = "ctrl" | "shift" | "alt" | "meta";

type Modifiers = Partial<Record<ModifierKey, boolean>>;

type PlatformModifiers = {
  mac?: ModifierKey;
  windows?: ModifierKey;
  linux?: ModifierKey;
  other?: ModifierKey;
};

type KeyPressOptions = {
  // Target
  target?: Window | Document | HTMLElement | null;
  scope?: "global" | "element";

  // Behavior
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;

  // Filtering
  when?: KeyPredicate;
  ignoreElements?: string[];
  onlyFromElements?: string[];

  // Modifiers
  modifiers?: Modifiers;
  strictModifiers?: boolean;

  // Event
  eventType?: KeyboardEventType;
};

type KeyPressControl = {
  isEnabled: boolean;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
  destroy: () => void;
};

type KeyStateOptions = {
  target?: Window | Document | HTMLElement | null;
  detailed?: boolean;
  trackDuration?: boolean;
  trackCount?: boolean;
  enabled?: boolean;
};

type KeyStateDetailed = {
  pressed: boolean;
  pressedAt: number | null;
  releasedAt: number | null;
  duration: number;
  count: number;
};

type KeySequenceOptions = {
  timeout?: number;
  preventDefault?: boolean;
  target?: Window | Document | HTMLElement | null;
  enabled?: boolean;
};

type KeymapOptions = {
  enabled?: boolean;
  scope?: "global" | "element";
  preventDefault?: boolean;
  target?: Window | Document | HTMLElement | null;
  inheritGlobal?: boolean;
};

type KeymapControl = {
  enable: (shortcut?: string) => void;
  disable: (shortcut?: string) => void;
  getBindings: () => Record<string, boolean>;
  isEnabled: (shortcut: string) => boolean;
};

type KeyPressHandler = (event: KeyboardEvent) => void;

// ═══════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════

const DEFAULT_IGNORE_ELEMENTS = ["INPUT", "TEXTAREA", "SELECT"];
const DEFAULT_SEQUENCE_TIMEOUT = 1000;

// Cache platform detection result (never changes during runtime)
const IS_MAC =
  typeof navigator !== "undefined" &&
  navigator.platform.toLowerCase().includes("mac");

function getDefaultTarget(): Window | null {
  return typeof window !== "undefined" ? window : null;
}

function isGlobalTarget(target: unknown): boolean {
  return target === window || target === document;
}

function isMac(): boolean {
  return IS_MAC;
}

function shouldIgnoreEvent(
  event: KeyboardEvent,
  ignoreElements?: string[],
  onlyFromElements?: string[]
): boolean {
  const target = event.target;

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

function keyMatches(event: KeyboardEvent, keyMatcher: KeyMatcher): boolean {
  if (typeof keyMatcher === "function") {
    return keyMatcher(event);
  }

  if (typeof keyMatcher === "string") {
    return event.key === keyMatcher || event.code === keyMatcher;
  }

  // Array matcher
  for (const key of keyMatcher) {
    if (event.key === key || event.code === key) {
      return true;
    }
  }
  return false;
}

/**
 * Parse key string notation (e.g., "ctrl+shift+k", "mod+s")
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Parser needs complexity for modifier handling
function parseKeyString(keyString: string): {
  key: string;
  modifiers: Modifiers;
} {
  const parts = keyString
    .toLowerCase()
    .split("+")
    .map((p) => p.trim());
  const modifiers: Modifiers = {};
  let key: string | undefined;

  for (const part of parts) {
    if (part === "ctrl" || part === "control") {
      modifiers.ctrl = true;
    } else if (part === "shift") {
      modifiers.shift = true;
    } else if (part === "alt" || part === "option") {
      modifiers.alt = true;
    } else if (part === "meta" || part === "cmd" || part === "command") {
      modifiers.meta = true;
    } else if (part === "mod") {
      const modKey: ModifierKey = isMac() ? "meta" : "ctrl";
      modifiers[modKey] = true;
    } else {
      key = part;
    }
  }

  if (!key) {
    throw new Error(`Invalid key string: ${keyString} - no key specified`);
  }

  return { key, modifiers };
}

// ═══════════════════════════════════════════════════
// INTERNAL HOOK IMPLEMENTATION
// ═══════════════════════════════════════════════════

function useKeyPressInternal(
  keyMatcher: KeyMatcher,
  handler: KeyPressHandler,
  options: KeyPressOptions = {}
): KeyPressControl {
  const {
    target = getDefaultTarget(),
    eventType = "keydown",
    enabled: enabledOption = true,
    preventDefault = false,
    stopPropagation = false,
    modifiers,
    strictModifiers = true,
    ignoreElements,
    onlyFromElements,
    when,
  } = options;

  const [enabled, setEnabled] = useState(enabledOption);

  const configRef = useRef({
    modifiers,
    strictModifiers,
    ignoreElements,
    onlyFromElements,
    preventDefault,
    stopPropagation,
    when,
  });

  useEffect(() => {
    configRef.current = {
      modifiers,
      strictModifiers,
      ignoreElements,
      onlyFromElements,
      preventDefault,
      stopPropagation,
      when,
    };
  });

  const onKeyPress = useEffectEvent((event: KeyboardEvent) => {
    const config = configRef.current;

    // Check custom when condition
    if (config.when && !config.when(event)) {
      return;
    }

    // Only filter by element when listening on global targets
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

    if (!keyMatches(event, keyMatcher)) {
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
  }, [target, eventType, enabled, onKeyPress]);

  const control: KeyPressControl = useMemo(
    () => ({
      isEnabled: enabled,
      enable: () => setEnabled(true),
      disable: () => setEnabled(false),
      toggle: () => setEnabled((prev) => !prev),
      destroy: () => setEnabled(false),
    }),
    [enabled]
  );

  return control;
}

// ═══════════════════════════════════════════════════
// FUNCTIONAL BUILDER PATTERN
// ═══════════════════════════════════════════════════

type KeyPressBuilderAPI = {
  // Modifier methods
  withModifiers: (modifiers: Modifiers) => KeyPressBuilderAPI;
  mod: (platform?: PlatformModifiers) => KeyPressBuilderAPI;
  ctrl: () => KeyPressBuilderAPI;
  shift: () => KeyPressBuilderAPI;
  alt: () => KeyPressBuilderAPI;
  meta: () => KeyPressBuilderAPI;

  // Target methods
  onGlobal: () => KeyPressBuilderAPI;
  onTarget: (
    target: RefObject<HTMLElement | null> | EventTarget
  ) => KeyPressBuilderAPI;

  // Behavior methods
  preventDefault: () => KeyPressBuilderAPI;
  stopPropagation: () => KeyPressBuilderAPI;
  when: (predicate: KeyPredicate) => KeyPressBuilderAPI;
  ignoreInputs: () => KeyPressBuilderAPI;

  // Terminal method
  handle: (handler: KeyPressHandler) => KeyPressControl;
};

function createKeyPressBuilder(
  keyMatcher: KeyMatcher,
  initialOptions: KeyPressOptions = {}
): KeyPressBuilderAPI {
  const options = { ...initialOptions };

  // Helper to create new builder with updated config
  const updateConfig = (
    updates: Partial<KeyPressOptions>
  ): KeyPressBuilderAPI =>
    createKeyPressBuilder(keyMatcher, {
      ...options,
      ...updates,
    });

  // Helper to merge modifiers
  const mergeModifiers = (newModifiers: Modifiers): KeyPressBuilderAPI =>
    updateConfig({
      modifiers: {
        ...options.modifiers,
        ...newModifiers,
      },
    });

  return {
    // Modifier methods
    withModifiers: (modifiers) => mergeModifiers(modifiers),

    mod: (platform) => {
      const platformIsMac = isMac();
      let key: ModifierKey;

      if (platform) {
        const platformKey = platformIsMac ? "mac" : "other";
        key = platform[platformKey] ?? "ctrl";
      } else {
        key = platformIsMac ? "meta" : "ctrl";
      }

      return mergeModifiers({ [key]: true });
    },

    ctrl: () => mergeModifiers({ ctrl: true }),
    shift: () => mergeModifiers({ shift: true }),
    alt: () => mergeModifiers({ alt: true }),
    meta: () => mergeModifiers({ meta: true }),

    // Target methods
    onGlobal: () =>
      updateConfig({
        scope: "global",
        target: getDefaultTarget(),
      }),

    onTarget: (target) => {
      const resolvedTarget = "current" in target ? target.current : target;
      return updateConfig({
        target: resolvedTarget as Window | Document | HTMLElement | null,
      });
    },

    // Behavior methods
    preventDefault: () => updateConfig({ preventDefault: true }),
    stopPropagation: () => updateConfig({ stopPropagation: true }),
    when: (predicate) => updateConfig({ when: predicate }),
    ignoreInputs: () =>
      updateConfig({
        ignoreElements: DEFAULT_IGNORE_ELEMENTS,
      }),

    // Terminal method
    handle: (handler) => useKeyPressInternal(keyMatcher, handler, options),
  };
}

// ═══════════════════════════════════════════════════
// MAIN HOOKS
// ═══════════════════════════════════════════════════

/**
 * Hook for handling keyboard events with flexible matching and filtering options.
 *
 * @example
 * // Simple key press
 * useKeyPress("Escape", onClose);
 *
 * @example
 * // String notation with modifiers
 * useKeyPress("ctrl+s", onSave);
 * useKeyPress("mod+k", onCommandPalette);
 *
 * @example
 * // Builder pattern
 * useKeyPress("s").mod().preventDefault().handle(onSave);
 *
 * @example
 * // Multiple keys
 * useKeyPress(["Enter", "NumpadEnter"], onSubmit);
 *
 * @example
 * // Custom matching function
 * useKeyPress((e) => e.key >= "0" && e.key <= "9", onNumberKey);
 *
 * @example
 * // With refs
 * useKeyPress("Enter").onTarget(inputRef).handle(onSubmit);
 *
 * @example
 * // Conditional execution
 * useKeyPress("Enter").when((e) => !showCommands).handle(onSubmit);
 */
// Builder pattern overloads
export function useKeyPress(
  keyMatcher: KeyMatcher | string,
  options?: KeyPressOptions
): KeyPressBuilderAPI;
// Direct hook overloads
export function useKeyPress(
  keyMatcher: KeyMatcher | string,
  handler: KeyPressHandler,
  options?: KeyPressOptions
): KeyPressControl;
// Implementation
export function useKeyPress(
  keyMatcher: KeyMatcher | string,
  handlerOrOptions?: KeyPressHandler | KeyPressOptions,
  optionsOrUndefined?: KeyPressOptions
): KeyPressBuilderAPI | KeyPressControl {
  // Parse key string notation if present
  const isStringKey = typeof keyMatcher === "string";
  const hasPlus = isStringKey && keyMatcher.includes("+");
  const parsed = hasPlus ? parseKeyString(keyMatcher as string) : null;
  const finalKey = parsed ? parsed.key : keyMatcher;
  const parsedModifiers = parsed ? parsed.modifiers : {};

  // Determine pattern based on arguments
  const isFunction = typeof handlerOrOptions === "function";
  const isObject =
    typeof handlerOrOptions === "object" && handlerOrOptions !== null;
  const hasOptions = Boolean(optionsOrUndefined);

  // Pattern 1 & 4: Builder pattern (no handler provided)
  if (!isFunction) {
    const builderOptions = isObject
      ? {
          ...handlerOrOptions,
          modifiers: {
            ...parsedModifiers,
            ...handlerOrOptions.modifiers,
          },
        }
      : { modifiers: parsedModifiers };

    return createKeyPressBuilder(finalKey, builderOptions);
  }

  // Pattern 2 & 3: Direct hook calls (handler provided)
  const handler = handlerOrOptions as KeyPressHandler;
  const options: KeyPressOptions = hasOptions
    ? {
        ...optionsOrUndefined,
        modifiers: {
          ...parsedModifiers,
          ...optionsOrUndefined?.modifiers,
        },
      }
    : { modifiers: parsedModifiers };

  // biome-ignore lint/correctness/useHookAtTopLevel: This function acts as both a hook and builder factory
  return useKeyPressInternal(finalKey, handler, options);
}

/**
 * Hook that tracks whether a key is currently pressed.
 *
 * @example
 * // Simple boolean state
 * const isShiftPressed = useKeyState("Shift");
 *
 * @example
 * // Detailed state with timing
 * const shiftState = useKeyState("Shift", { detailed: true });
 * // Returns: { pressed, pressedAt, releasedAt, duration, count }
 *
 * @example
 * // Track hold duration
 * const spaceState = useKeyState("Space", { trackDuration: true });
 */
export function useKeyState(
  keyMatcher: KeyMatcher,
  options: KeyStateOptions = {}
): boolean | KeyStateDetailed {
  const {
    detailed = false,
    trackDuration = false,
    trackCount = false,
  } = options;

  const [isPressed, setIsPressed] = useState(false);
  const [pressedAt, setPressedAt] = useState<number | null>(null);
  const [releasedAt, setReleasedAt] = useState<number | null>(null);
  const [count, setCount] = useState(0);

  useKeyPress(
    keyMatcher,
    () => {
      setIsPressed(true);
      if (trackDuration || detailed) {
        setPressedAt(Date.now());
      }
      if (trackCount || detailed) {
        setCount((prev) => prev + 1);
      }
    },
    {
      eventType: "keydown",
      target: options.target,
      enabled: options.enabled,
    }
  );

  useKeyPress(
    keyMatcher,
    () => {
      setIsPressed(false);
      if (trackDuration || detailed) {
        setReleasedAt(Date.now());
      }
    },
    {
      eventType: "keyup",
      target: options.target,
      enabled: options.enabled,
    }
  );

  // Compute detailed state with useMemo to prevent recalculation on every render
  const detailedState = useMemo((): KeyStateDetailed => {
    let duration = 0;
    if (pressedAt && isPressed) {
      duration = Date.now() - pressedAt;
    } else if (pressedAt && releasedAt) {
      duration = releasedAt - pressedAt;
    }

    return {
      pressed: isPressed,
      pressedAt,
      releasedAt,
      duration,
      count,
    };
  }, [isPressed, pressedAt, releasedAt, count]);

  if (detailed) {
    return detailedState;
  }

  return isPressed;
}

/**
 * Convenience hook for keyboard shortcuts with modifier keys.
 *
 * @example
 * // String notation with modifiers
 * useKeyboardShortcut("mod+s", onSave);
 * useKeyboardShortcut("ctrl+shift+z", onRedo);
 *
 * @example
 * // Multiple shortcuts for same action
 * useKeyboardShortcut(["cmd+k", "ctrl+k"], onCommandPalette);
 *
 * @example
 * // With additional options
 * useKeyboardShortcut("mod+s", onSave, { enabled: false });
 */
export function useKeyboardShortcut(
  keyOrShortcut: string | string[],
  handler: KeyPressHandler,
  options?: Omit<
    KeyPressOptions,
    "modifiers" | "preventDefault" | "strictModifiers"
  >
): KeyPressControl {
  // Determine options based on input type
  const isArray = Array.isArray(keyOrShortcut);
  const key = isArray ? keyOrShortcut[0] : keyOrShortcut;

  // Parse string notation (all shortcuts must use string notation now)
  const parsed = parseKeyString(key);

  // Build options for the internal hook
  const internalOptions: KeyPressOptions = {
    preventDefault: true,
    strictModifiers: true,
    modifiers: parsed.modifiers,
    ...options,
  };

  // Call hook with computed options (unconditional call)
  const primaryControl = useKeyPressInternal(
    parsed.key,
    handler,
    internalOptions
  );

  // Handle array of shortcuts
  // biome-ignore lint/correctness/useHookAtTopLevel: Stable array length ensures consistent hook calls
  // biome-ignore lint/nursery/noShadow: Local scope parsing needed for each shortcut
  const additionalControls = isArray
    ? keyOrShortcut.slice(1).map((shortcut) => {
        const parsedShortcut = parseKeyString(shortcut);
        const opts: KeyPressOptions = {
          preventDefault: true,
          strictModifiers: true,
          modifiers: parsedShortcut.modifiers,
          ...options,
        };
        return useKeyPressInternal(parsedShortcut.key, handler, opts);
      })
    : [];

  // If array, combine controls
  if (isArray) {
    const allControls = [primaryControl, ...additionalControls];
    return {
      isEnabled: allControls.every((c) => c.isEnabled),
      enable: () => {
        for (const c of allControls) {
          c.enable();
        }
      },
      disable: () => {
        for (const c of allControls) {
          c.disable();
        }
      },
      toggle: () => {
        for (const c of allControls) {
          c.toggle();
        }
      },
      destroy: () => {
        for (const c of allControls) {
          c.destroy();
        }
      },
    };
  }

  return primaryControl;
}

/**
 * Hook for handling key sequences (e.g., "g" then "d").
 *
 * @example
 * // Vim-like navigation
 * useKeySequence(["g", "d"], onGoToDefinition);
 * useKeySequence(["g", "g"], onGoToTop);
 *
 * @example
 * // Custom timeout
 * useKeySequence(["g", "d"], onGoToDefinition, { timeout: 500 });
 */
export function useKeySequence(
  sequence: string[],
  handler: KeyPressHandler,
  options: KeySequenceOptions = {}
): KeyPressControl {
  const {
    timeout = DEFAULT_SEQUENCE_TIMEOUT,
    preventDefault = false,
    target = getDefaultTarget(),
    enabled: enabledOption = true,
  } = options;

  const [enabled, setEnabled] = useState(enabledOption);
  const sequenceIndexRef = useRef(0);
  const timeoutIdRef = useRef<number | null>(null);

  const resetSequence = useEffectEvent(() => {
    sequenceIndexRef.current = 0;
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  });

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const expectedKey = sequence[sequenceIndexRef.current];

    if (event.key === expectedKey || event.code === expectedKey) {
      if (preventDefault) {
        event.preventDefault();
      }

      sequenceIndexRef.current++;

      // Clear existing timeout
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
      }

      // Check if sequence is complete
      if (sequenceIndexRef.current === sequence.length) {
        handler(event);
        resetSequence();
      } else {
        // Set timeout for next key
        timeoutIdRef.current = setTimeout(
          resetSequence,
          timeout
        ) as unknown as number;
      }
    } else {
      // Wrong key, reset sequence
      resetSequence();
    }
  });

  useEffect(() => {
    if (!(enabled && target)) {
      return;
    }

    const eventListener = (event: Event) => {
      onKeyDown(event as KeyboardEvent);
    };

    target.addEventListener("keydown", eventListener);

    return () => {
      target.removeEventListener("keydown", eventListener);
      resetSequence();
    };
  }, [target, enabled, onKeyDown, resetSequence]);

  return {
    isEnabled: enabled,
    enable: () => setEnabled(true),
    disable: () => setEnabled(false),
    toggle: () => setEnabled((prev) => !prev),
    destroy: () => {
      setEnabled(false);
      resetSequence();
    },
  };
}

/**
 * Hook for managing multiple keyboard shortcuts as a keymap.
 *
 * @example
 * const keymap = useKeymap({
 *   "mod+s": onSave,
 *   "mod+k": onCommandPalette,
 *   "Escape": onClose,
 * });
 *
 * @example
 * // Dynamic control
 * keymap.disable("Escape");
 * keymap.enable("Escape");
 */
export function useKeymap(
  bindings: Record<string, KeyPressHandler>,
  options: KeymapOptions = {}
): KeymapControl {
  const { enabled: enabledOption = true } = options;

  const [enabledBindings, setEnabledBindings] = useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {};
    for (const key of Object.keys(bindings)) {
      initial[key] = enabledOption;
    }
    return initial;
  });

  // Create individual controls for each binding
  const controlsRef = useRef<Record<string, KeyPressControl>>({});

  // Set up all bindings - bindings object must remain stable across renders
  // NOTE: This violates Rules of Hooks by calling hooks in a loop, but the number of iterations
  // is stable as long as the bindings object keys don't change between renders.
  // biome-ignore lint/correctness/useHookAtTopLevel: Stable loop iteration count required for dynamic keymaps
  for (const [shortcut, handler] of Object.entries(bindings)) {
    const isEnabled = enabledBindings[shortcut] ?? true;

    const control = useKeyboardShortcut(shortcut, handler, {
      ...options,
      enabled: isEnabled,
    });

    controlsRef.current[shortcut] = control;
  }

  const keymapControl: KeymapControl = useMemo(
    () => ({
      enable: (shortcut) => {
        if (shortcut) {
          setEnabledBindings((prev) => ({ ...prev, [shortcut]: true }));
          controlsRef.current[shortcut]?.enable();
        } else {
          const allEnabled: Record<string, boolean> = {};
          for (const key of Object.keys(bindings)) {
            allEnabled[key] = true;
          }
          setEnabledBindings(allEnabled);
          for (const control of Object.values(controlsRef.current)) {
            control.enable();
          }
        }
      },

      disable: (shortcut) => {
        if (shortcut) {
          setEnabledBindings((prev) => ({ ...prev, [shortcut]: false }));
          controlsRef.current[shortcut]?.disable();
        } else {
          const allDisabled: Record<string, boolean> = {};
          for (const key of Object.keys(bindings)) {
            allDisabled[key] = false;
          }
          setEnabledBindings(allDisabled);
          for (const control of Object.values(controlsRef.current)) {
            control.disable();
          }
        }
      },

      getBindings: () => ({ ...enabledBindings }),

      isEnabled: (shortcut) => enabledBindings[shortcut] ?? false,
    }),
    [enabledBindings, bindings]
  );

  return keymapControl;
}

// ═══════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════

export type {
  KeyMatcher,
  KeyboardEventType,
  Modifiers,
  KeyPressOptions,
  KeyPressHandler,
  KeyPressControl,
  KeyStateOptions,
  KeyStateDetailed,
  KeySequenceOptions,
  KeymapOptions,
  KeymapControl,
  KeyPredicate,
  ModifierKey,
  PlatformModifiers,
};
