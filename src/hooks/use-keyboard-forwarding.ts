import type { KeyboardEvent, RefObject } from "react";

type KeyboardForwardingConfig<
  TSource extends HTMLElement = HTMLElement,
  TTarget extends HTMLElement = HTMLElement,
> = {
  targetRef: RefObject<TTarget | null>;
  forwardKeys: readonly string[];
  shouldForward?: boolean | (() => boolean);
  specialKeyHandlers?: Partial<
    Record<string, (event: KeyboardEvent<TSource>) => void>
  >;
  preventDefaultOnForward?: boolean;
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
