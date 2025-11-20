/** biome-ignore-all lint/correctness/useHookAtTopLevel: <custom hook> */
import {
  type RefObject,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";

type KeyPredicate = (event: KeyboardEvent) => boolean;

type KeyMatcher = string | string[] | KeyPredicate;

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
  target?: Window | Document | HTMLElement | null;
  scope?: "global" | "element";
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  when?: KeyPredicate;
  ignoreElements?: string[];
  onlyFromElements?: string[];
  modifiers?: Modifiers;
  strictModifiers?: boolean;
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

const DEFAULT_IGNORE_ELEMENTS = ["INPUT", "TEXTAREA", "SELECT"];

const DEFAULT_SEQUENCE_TIMEOUT = 1000;

let cachedIsMac: boolean | undefined;

function getDefaultTarget(): Window | null {
  return typeof window !== "undefined" ? window : null;
}

function isGlobalTarget(target: unknown): boolean {
  return target === window || target === document;
}

function isMac(): boolean {
  if (cachedIsMac === undefined) {
    cachedIsMac =
      typeof navigator !== "undefined" &&
      navigator.platform.toLowerCase().includes("mac");
  }
  return cachedIsMac;
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

  for (const key of keyMatcher) {
    if (event.key === key || event.code === key) {
      return true;
    }
  }
  return false;
}

/**
 * Memoization cache for parsed key strings
 * Improves performance by avoiding repeated parsing
 */
const parsedKeyCache = new Map<
  string,
  {
    key: string;
    modifiers: Modifiers;
  }
>();

function parseKeyString(keyString: string): {
  key: string;
  modifiers: Modifiers;
} {
  const cached = parsedKeyCache.get(keyString);
  if (cached) {
    return cached;
  }

  const modifiers: Modifiers = {};

  const aliasMap: Record<string, ModifierKey | "mod"> = {
    ctrl: "ctrl",
    control: "ctrl",
    shift: "shift",
    alt: "alt",
    option: "alt",
    meta: "meta",
    cmd: "meta",
    command: "meta",
    mod: "mod",
  };

  let key: string | undefined;

  for (const raw of keyString.toLowerCase().split("+")) {
    const part = raw.trim();
    const mapped = aliasMap[part];

    if (mapped === "mod") {
      modifiers[isMac() ? "meta" : "ctrl"] = true;
    } else if (mapped) {
      modifiers[mapped] = true;
    } else {
      key = part;
    }
  }

  if (!key) {
    throw new Error(`Invalid key string: ${keyString} - no key specified`);
  }

  const parsed = { key, modifiers };
  parsedKeyCache.set(keyString, parsed);
  return parsed;
}

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

    if (config.when && !config.when(event)) {
      return;
    }

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

  return {
    isEnabled: enabled,
    enable: () => setEnabled(true),
    disable: () => setEnabled(false),
    toggle: () => setEnabled((prev) => !prev),
    destroy: () => setEnabled(false),
  };
}

function useMultiKeyPress(
  bindings: Array<{
    shortcut: string;
    key: string;
    modifiers: Modifiers;
    handler: KeyPressHandler;
  }>,
  enabledMap: Record<string, boolean>,
  options: KeyPressOptions = {}
): void {
  const stableBindings = useMemo(() => bindings, [bindings]);

  const multiHandler = useEffectEvent((event: KeyboardEvent) => {
    for (const binding of stableBindings) {
      if (!enabledMap[binding.shortcut]) {
        continue;
      }

      if (
        keyMatches(event, binding.key) &&
        modifiersMatch(event, binding.modifiers, true)
      ) {
        binding.handler(event);
        break;
      }
    }
  });

  const multiMatcher = useCallback(
    (event: KeyboardEvent): boolean =>
      stableBindings.some(
        (binding) =>
          enabledMap[binding.shortcut] &&
          keyMatches(event, binding.key) &&
          modifiersMatch(event, binding.modifiers, true)
      ),
    [stableBindings, enabledMap]
  );

  useKeyPressInternal(multiMatcher, multiHandler, {
    ...options,
    preventDefault: options.preventDefault ?? true,
    strictModifiers: true,
  });
}

type KeyPressBuilderAPI = {
  withModifiers: (modifiers: Modifiers) => KeyPressBuilderAPI;
  mod: (platform?: PlatformModifiers) => KeyPressBuilderAPI;
  ctrl: () => KeyPressBuilderAPI;
  shift: () => KeyPressBuilderAPI;
  alt: () => KeyPressBuilderAPI;
  meta: () => KeyPressBuilderAPI;
  onGlobal: () => KeyPressBuilderAPI;
  onTarget: (
    target: RefObject<HTMLElement | null> | EventTarget
  ) => KeyPressBuilderAPI;
  preventDefault: () => KeyPressBuilderAPI;
  stopPropagation: () => KeyPressBuilderAPI;
  when: (predicate: KeyPredicate) => KeyPressBuilderAPI;
  ignoreInputs: () => KeyPressBuilderAPI;
  handle: (handler: KeyPressHandler) => KeyPressControl;
};

function createKeyPressBuilder(
  keyMatcher: KeyMatcher,
  initialOptions: KeyPressOptions = {}
): KeyPressBuilderAPI {
  const options = { ...initialOptions };

  const updateConfig = (
    updates: Partial<KeyPressOptions>
  ): KeyPressBuilderAPI =>
    createKeyPressBuilder(keyMatcher, {
      ...options,
      ...updates,
    });

  const mergeModifiers = (newModifiers: Modifiers): KeyPressBuilderAPI =>
    updateConfig({
      modifiers: {
        ...options.modifiers,
        ...newModifiers,
      },
    });

  return {
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
    preventDefault: () => updateConfig({ preventDefault: true }),
    stopPropagation: () => updateConfig({ stopPropagation: true }),
    when: (predicate) => updateConfig({ when: predicate }),
    ignoreInputs: () =>
      updateConfig({
        ignoreElements: DEFAULT_IGNORE_ELEMENTS,
      }),
    handle: (handler) => useKeyPressInternal(keyMatcher, handler, options),
  };
}

export function useKeyPress(
  keyMatcher: KeyMatcher | string,
  options?: KeyPressOptions
): KeyPressBuilderAPI;
export function useKeyPress(
  keyMatcher: KeyMatcher | string,
  handler: KeyPressHandler,
  options?: KeyPressOptions
): KeyPressControl;
export function useKeyPress(
  keyMatcher: KeyMatcher | string,
  handlerOrOptions?: KeyPressHandler | KeyPressOptions,
  optionsOrUndefined?: KeyPressOptions
): KeyPressBuilderAPI | KeyPressControl {
  const parsed = useMemo(() => {
    if (typeof keyMatcher === "string" && keyMatcher.includes("+")) {
      return parseKeyString(keyMatcher);
    }
    return null;
  }, [keyMatcher]);

  const finalKey = parsed ? parsed.key : keyMatcher;
  const parsedModifiers = parsed ? parsed.modifiers : {};

  const isFunction = typeof handlerOrOptions === "function";
  const isObject =
    typeof handlerOrOptions === "object" && handlerOrOptions !== null;
  const hasOptions = Boolean(optionsOrUndefined);

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

  return useKeyPressInternal(finalKey, handler, options);
}

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

export function useKeyboardShortcut(
  keyOrShortcut: string | string[],
  handler: KeyPressHandler,
  options?: Omit<
    KeyPressOptions,
    "modifiers" | "preventDefault" | "strictModifiers"
  >
): KeyPressControl {
  const isArray = Array.isArray(keyOrShortcut);
  const shortcuts = isArray ? keyOrShortcut : [keyOrShortcut];

  const parsedShortcuts = useMemo(
    () => shortcuts.map((s) => parseKeyString(s)),
    [shortcuts]
  );

  const bindings = useMemo(
    () =>
      parsedShortcuts.map((parsed, index) => ({
        shortcut: shortcuts[index],
        key: parsed.key,
        modifiers: parsed.modifiers,
        handler,
      })),
    [parsedShortcuts, shortcuts, handler]
  );

  const [enabled, setEnabled] = useState(true);

  const enabledMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const shortcut of shortcuts) {
      map[shortcut] = enabled;
    }
    return map;
  }, [shortcuts, enabled]);

  useMultiKeyPress(bindings, enabledMap, {
    ...options,
    preventDefault: true,
    enabled,
  });

  return {
    isEnabled: enabled,
    enable: () => setEnabled(true),
    disable: () => setEnabled(false),
    toggle: () => setEnabled((prev) => !prev),
    destroy: () => setEnabled(false),
  };
}

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

      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
      }

      if (sequenceIndexRef.current === sequence.length) {
        handler(event);
        resetSequence();
      } else {
        timeoutIdRef.current = setTimeout(
          resetSequence,
          timeout
        ) as unknown as number;
      }
    } else {
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

  const parsedBindings = useMemo(
    () =>
      Object.entries(bindings).map(([shortcut, handler]) => {
        const parsed = parseKeyString(shortcut);
        return {
          shortcut,
          key: parsed.key,
          modifiers: parsed.modifiers,
          handler,
        };
      }),
    [bindings]
  );

  useMultiKeyPress(parsedBindings, enabledBindings, {
    ...options,
    preventDefault: options.preventDefault ?? true,
  });

  return {
    enable: (shortcut) => {
      if (shortcut) {
        setEnabledBindings((prev) => ({ ...prev, [shortcut]: true }));
      } else {
        const allEnabled: Record<string, boolean> = {};
        for (const key of Object.keys(bindings)) {
          allEnabled[key] = true;
        }
        setEnabledBindings(allEnabled);
      }
    },
    disable: (shortcut) => {
      if (shortcut) {
        setEnabledBindings((prev) => ({ ...prev, [shortcut]: false }));
      } else {
        const allDisabled: Record<string, boolean> = {};
        for (const key of Object.keys(bindings)) {
          allDisabled[key] = false;
        }
        setEnabledBindings(allDisabled);
      }
    },
    getBindings: () => ({ ...enabledBindings }),
    isEnabled: (shortcut) => enabledBindings[shortcut] ?? false,
  };
}

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
