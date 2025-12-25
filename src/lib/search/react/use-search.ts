import { useCallback, useMemo, useState } from "react";

import type { SearchClient } from "../core/client";
import type {
  BaseSearchItem,
  SearchItem,
  SearchOptions,
  SearchResult,
} from "../core/types";
import { useSearchClient } from "./provider";

export type GroupedResults<TItem extends BaseSearchItem = SearchItem> = Record<
  string,
  SearchResult<TItem>[]
>;

export interface UseSearchOptions extends SearchOptions {
  grouped?: boolean;
  groupBy?: (item: BaseSearchItem) => string;
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

function defaultGroupBy(item: BaseSearchItem): string {
  if ("meta" in item && item.meta && typeof item.meta === "object") {
    const meta = item.meta as Record<string, unknown>;
    if (typeof meta.category === "string") {
      return meta.category;
    }
  }
  return "default";
}

export function useSearch<TItem extends BaseSearchItem = SearchItem>(
  options: UseSearchOptions = {}
): UseSearchReturn<TItem> {
  const client = useSearchClient() as SearchClient<TItem>;
  const [query, setQueryState] = useState("");

  const {
    grouped = true,
    groupBy = defaultGroupBy,
    limit,
    threshold,
    includeMatches,
  } = options;

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
