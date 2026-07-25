import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";

import { createSearch } from "../core";
import type { BaseSearchItem, SearchItem } from "../core";
import type { UseSearchOptions, UseSearchReturn } from "./types";

const DEFAULT_DEBOUNCE_MS = 300;

export const useSearch = <
  TItem extends BaseSearchItem = SearchItem,
  TGroupKeys extends string = string,
>(
  options: UseSearchOptions<TItem, TGroupKeys>
): UseSearchReturn<TItem, TGroupKeys> => {
  const { debounceMs = DEFAULT_DEBOUNCE_MS, ...searchOptions } = options;

  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounceValue(query, debounceMs);

  const search = createSearch<TItem, TGroupKeys>(searchOptions);

  const { all, filtered, grouped } = search.getResults(debouncedQuery);

  return {
    filtered,
    grouped,
    hasResults: filtered.length > 0,
    query,
    results: all,
    search,
    setQuery,
  };
};
