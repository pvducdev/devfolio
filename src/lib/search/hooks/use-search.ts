import { useMemo, useRef, useState } from "react";
import { useUnmount } from "usehooks-ts";
import { createSearchService } from "../service";
import type { GroupedResults } from "../types";

export function useSearch() {
  const [query, setQuery] = useState("");
  const serviceRef = useRef(createSearchService());

  useUnmount(() => {
    serviceRef.current.clear();
  });

  const results: GroupedResults = useMemo(() => {
    if (query.trim() === "") {
      return serviceRef.current.getAllGrouped();
    }

    return serviceRef.current.searchGrouped(query);
  }, [query]);

  const hasResults =
    results.pages.length > 0 ||
    results.commands.length > 0 ||
    results.content.length > 0;

  return {
    query,
    setQuery,
    results,
    hasResults,
    clearQuery: () => setQuery(""),
  };
}
