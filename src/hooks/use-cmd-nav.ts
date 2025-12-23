import type { RefObject } from "react";
import { useKeyboardForwarding } from "./use-keyboard-forwarding.ts";

const INTERACTIVE_KEYS = ["ArrowUp", "ArrowDown", "Enter", "Escape"] as const;

interface UseCmdNavOptions {
  commandRef: RefObject<HTMLDivElement | null>;
  showCommands: boolean;
  onTabSelect: () => void;
}

export function useCmdNav({
  commandRef,
  showCommands,
  onTabSelect,
}: UseCmdNavOptions) {
  return useKeyboardForwarding<HTMLTextAreaElement, HTMLDivElement>({
    targetRef: commandRef,
    forwardKeys: INTERACTIVE_KEYS,
    shouldForward: showCommands,
    specialKeyHandlers: {
      Tab: () => onTabSelect(),
    },
  });
}
