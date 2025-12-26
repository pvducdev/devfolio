import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import type { BaseSearchItem, SearchItem } from "@/lib/search/core";
import type { UseSearchOptions, UseSearchReturn } from "./types.ts";

const DEFAULT_DEBOUNCE_MS = 300;

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
