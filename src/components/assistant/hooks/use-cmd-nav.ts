import type { KeyboardEvent, RefObject } from "react";

const INTERACTIVE_KEYS = ["ArrowUp", "ArrowDown", "Enter", "Escape"] as const;

type UseCmdNavOptions = {
  commandRef: RefObject<HTMLDivElement | null>;
  showCommands: boolean;
  onTabSelect: () => void;
};

export function useCmdNav({
  commandRef,
  showCommands,
  onTabSelect,
}: UseCmdNavOptions) {
  return (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showCommands) {
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      onTabSelect();
      return;
    }

    if (INTERACTIVE_KEYS.includes(e.key as (typeof INTERACTIVE_KEYS)[number])) {
      commandRef.current?.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: e.key,
          code: e.code,
          bubbles: true,
          cancelable: true,
        })
      );
      e.preventDefault();
    }
  };
}
