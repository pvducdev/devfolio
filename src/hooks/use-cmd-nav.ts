import type { RefObject } from "react";

import { useKeyboardForwarding } from "./use-keyboard-forwarding.ts";

const INTERACTIVE_KEYS = ["ArrowUp", "ArrowDown", "Enter", "Escape"] as const;

interface UseCmdNavOptions {
  commandRef: RefObject<HTMLDivElement | null>;
  showCommands: boolean;
  onTabSelect: () => void;
}

export const useCmdNav = ({
  commandRef,
  showCommands,
  onTabSelect,
}: UseCmdNavOptions) =>
  useKeyboardForwarding<HTMLTextAreaElement, HTMLDivElement>({
    forwardKeys: INTERACTIVE_KEYS,
    shouldForward: showCommands,
    specialKeyHandlers: {
      Tab: () => onTabSelect(),
    },
    targetRef: commandRef,
  });
