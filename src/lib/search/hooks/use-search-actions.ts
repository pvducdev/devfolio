import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

import type { SearchItem } from "../types";

export function useSearchActions() {
  const navigate = useNavigate();

  const executeAction = useCallback(
    (item: SearchItem, onComplete?: () => void) => {
      const { action } = item;

      switch (action.type) {
        case "navigate":
          navigate({ to: action.path });
          break;

        case "command":
          break;

        default:
          break;
      }

      onComplete?.();
    },
    [navigate]
  );

  return { executeAction };
}
