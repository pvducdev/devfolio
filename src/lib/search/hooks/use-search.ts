import { useMemo, useState } from "react";
import { createSearchService } from "../service";
import type { GroupedResults } from "../types";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [service] = useState(createSearchService);

  const results: GroupedResults = useMemo(() => {
    if (query.trim() === "") {
      return service.getAllGrouped();
    }

    return service.searchGrouped(query);
  }, [query, service]);

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
