import type { KeyboardEvent, RefObject } from "react";

/**
 * Configuration for keyboard event forwarding behavior
 */
type KeyboardForwardingConfig<
  TSource extends HTMLElement = HTMLElement,
  TTarget extends HTMLElement = HTMLElement,
> = {
  /**
   * Reference to the target element that will receive forwarded events
   */
  targetRef: RefObject<TTarget | null>;

  /**
   * Keys that should be forwarded to the target element
   * @example ["ArrowUp", "ArrowDown", "Enter", "Escape"]
   */
  forwardKeys: readonly string[];

  /**
   * Condition that must be true for forwarding to occur
   * @default true
   */
  shouldForward?: boolean | (() => boolean);

  /**
   * Special key handlers that run instead of forwarding
   * These handlers run when their key is pressed and shouldForward is true
   * @example { Tab: () => selectItem() }
   */
  specialKeyHandlers?: Partial<
    Record<string, (event: KeyboardEvent<TSource>) => void>
  >;

  /**
   * Whether to prevent default behavior for forwarded keys
   * @default true
   */
  preventDefaultOnForward?: boolean;

  /**
   * Additional properties to pass to the forwarded KeyboardEvent
   * @default { bubbles: true, cancelable: true }
   */
  eventProperties?: Partial<KeyboardEventInit>;
};

export function useKeyboardForwarding<
  TSource extends HTMLElement = HTMLElement,
  TTarget extends HTMLElement = HTMLElement,
>({
  targetRef,
  forwardKeys,
  shouldForward = true,
  specialKeyHandlers = {},
  preventDefaultOnForward = true,
  eventProperties = { bubbles: true, cancelable: true },
}: KeyboardForwardingConfig<TSource, TTarget>) {
  return (event: KeyboardEvent<TSource>) => {
    const isForwardingEnabled =
      typeof shouldForward === "function" ? shouldForward() : shouldForward;

    if (!isForwardingEnabled) {
      return;
    }

    const specialHandler = specialKeyHandlers[event.key];
    if (specialHandler) {
      event.preventDefault();
      specialHandler(event);
      return;
    }

    if (forwardKeys.includes(event.key)) {
      targetRef.current?.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: event.key,
          code: event.code,
          ...eventProperties,
        })
      );

      if (preventDefaultOnForward) {
        event.preventDefault();
      }
    }
  };
}
