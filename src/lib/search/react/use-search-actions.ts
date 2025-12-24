import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";

import type { ActionContext } from "../core/action";
import type { SearchClient } from "../core/client";
import type { BaseAction, BaseSearchItem, SearchItem } from "../core/types";
import { useSearchClient } from "./provider";

export interface UseSearchActionsOptions<
  TItem extends BaseSearchItem = SearchItem,
> {
  onSuccess?: (item: TItem) => void;
  onError?: (error: Error, item: TItem) => void;
  onClose?: () => void;
}

export interface UseSearchActionsReturn<
  TItem extends BaseSearchItem = SearchItem,
> {
  executeAction: (item: TItem & { action: BaseAction }) => Promise<void>;
  isExecuting: boolean;
}

export function useSearchActions<TItem extends BaseSearchItem = SearchItem>(
  options: UseSearchActionsOptions<TItem> = {}
): UseSearchActionsReturn<TItem> {
  const client = useSearchClient() as SearchClient<TItem>;
  const navigate = useNavigate();
  const [isExecuting, setIsExecuting] = useState(false);

  const executeAction = useCallback(
    async (item: TItem & { action: BaseAction }) => {
      setIsExecuting(true);

      const context: ActionContext = {
        navigate: (path) => navigate({ to: path }),
        close: options.onClose,
      };

      try {
        await client.executeAction(item, context);
        options.onSuccess?.(item);
      } catch (error) {
        options.onError?.(error as Error, item);
      } finally {
        setIsExecuting(false);
      }
    },
    [client, navigate, options.onSuccess, options.onError, options.onClose]
  );

  return {
    executeAction,
    isExecuting,
  };
}
