import { useCallback, useMemo, useState } from "react";

import type { SearchClient } from "../core/client";
import type {
  BaseSearchItem,
  GroupedResults,
  SearchItem,
  SearchOptions,
  SearchResult,
} from "../core/types";
import { useSearchClient } from "./provider";

export interface UseSearchOptions extends SearchOptions {
  grouped?: boolean;
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

export function useSearch<TItem extends BaseSearchItem = SearchItem>(
  options: UseSearchOptions = {}
): UseSearchReturn<TItem> {
  const client = useSearchClient() as SearchClient<TItem>;
  const [query, setQueryState] = useState("");

  const {
    grouped = true,
    limit,
    categories,
    threshold,
    includeMatches,
  } = options;

  const memoizedOptions = useMemo<SearchOptions>(
    () => ({ limit, categories, threshold, includeMatches }),
    [limit, categories, threshold, includeMatches]
  );

  const results = useMemo(() => {
    return client.search(query, memoizedOptions);
  }, [client, query, memoizedOptions]);

  const groupedResults = useMemo(() => {
    if (!grouped) {
      return {} as GroupedResults<TItem>;
    }
    return client.searchGrouped(query, memoizedOptions);
  }, [client, query, grouped, memoizedOptions]);

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
