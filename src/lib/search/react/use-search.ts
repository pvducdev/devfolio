import { useCallback, useMemo, useState } from "react";

import type { SearchClient } from "../core/client";
import type {
  BaseSearchItem,
  SearchItem,
  SearchOptions,
  SearchResult,
} from "../core/types";

export type GroupedResults<TItem extends BaseSearchItem = SearchItem> = Record<
  string,
  SearchResult<TItem>[]
>;

export interface UseSearchOptions<TItem extends BaseSearchItem = SearchItem>
  extends SearchOptions {
  client: SearchClient<TItem>;
  grouped?: boolean;
  groupBy?: (item: TItem) => string;
}

export interface UseSearchReturn<TItem extends BaseSearchItem = SearchItem> {
  query: string;
  setQuery: (query: string) => void;
  clearQuery: () => void;

  results: SearchResult<TItem>[];
  groupedResults: GroupedResults<TItem>;

  hasResults: boolean;
  isEmpty: boolean;
}

function defaultGroupBy<TItem extends BaseSearchItem>(item: TItem): string {
  if ("meta" in item && item.meta && typeof item.meta === "object") {
    const meta = item.meta as Record<string, unknown>;
    if (typeof meta.category === "string") {
      return meta.category;
    }
  }
  return "default";
}

export function useSearch<TItem extends BaseSearchItem = SearchItem>(
  options: UseSearchOptions<TItem>
): UseSearchReturn<TItem> {
  const {
    client,
    grouped = true,
    groupBy = defaultGroupBy,
    limit,
    threshold,
    includeMatches,
  } = options;

  const [query, setQueryState] = useState("");

  const memoizedOptions = useMemo<SearchOptions>(
    () => ({ limit, threshold, includeMatches }),
    [limit, threshold, includeMatches]
  );

  const results = useMemo(() => {
    return client.search(query, memoizedOptions);
  }, [client, query, memoizedOptions]);

  const groupedResults = useMemo(() => {
    if (!grouped) {
      return {} as GroupedResults<TItem>;
    }

    const groups: GroupedResults<TItem> = {};
    for (const result of results) {
      const category = groupBy(result.item);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(result);
    }
    return groups;
  }, [results, grouped, groupBy]);

  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);
  }, []);

  const clearQuery = useCallback(() => {
    setQueryState("");
  }, []);

  const hasResults = results.length > 0;
  const isEmpty = query.trim() !== "" && results.length === 0;

  return {
    query,
    setQuery,
    clearQuery,
    results,
    groupedResults,
    hasResults,
    isEmpty,
  };
}
