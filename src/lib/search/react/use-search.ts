import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";

import type { SearchClient } from "../core/client";
import type {
  BaseSearchItem,
  SearchItem,
  SearchOptions,
  SearchResult,
} from "../core/types";

export interface UseSearchOptions<TItem extends BaseSearchItem = SearchItem>
  extends SearchOptions {
  client: SearchClient<TItem>;
  debounceMs?: number;
}

export interface UseSearchReturn<TItem extends BaseSearchItem = SearchItem> {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult<TItem>[];
}

const DEFAULT_DEBOUNCE_MS = 100;

export function useSearch<TItem extends BaseSearchItem = SearchItem>(
  options: UseSearchOptions<TItem>
): UseSearchReturn<TItem> {
  const {
    client,
    limit,
    includeMatches,
    debounceMs = DEFAULT_DEBOUNCE_MS,
  } = options;

  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounceValue(query, debounceMs);

  const results = client.search(debouncedQuery, { limit, includeMatches });

  return { query, setQuery, results };
}
