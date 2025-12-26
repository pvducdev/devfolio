import { useMemo } from "react";
import {
  type AppSearchItem,
  buildContentItems,
  buildPageItems,
} from "@/config/search";
import { createFuseAdapter } from "@/lib/search/adapters";
import { createSearchClient, type SearchResult } from "@/lib/search/core";
import { useSearch } from "@/lib/search/react";

interface UseAppSearchOptions {
  debounceMs?: number;
}

interface GroupedResults {
  pages: SearchResult<AppSearchItem>[];
  content: SearchResult<AppSearchItem>[];
}

interface UseAppSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult<AppSearchItem>[];
  grouped: GroupedResults;
  hasResults: boolean;
}

const SEARCH_KEYS = [
  { name: "title", weight: 1.0 },
  { name: "description", weight: 0.7 },
  { name: "keywords", weight: 0.5 },
] as const;

function createAppSearchClient() {
  const client = createSearchClient<AppSearchItem>({
    adapter: createFuseAdapter<AppSearchItem>({ keys: [...SEARCH_KEYS] }),
  });

  client.add(buildPageItems());
  client.add(buildContentItems());

  return client;
}

export function useAppSearch(
  options?: UseAppSearchOptions
): UseAppSearchReturn {
  const { debounceMs } = options ?? {};

  const client = useMemo(() => createAppSearchClient(), []);

  const { query, setQuery, results } = useSearch({
    client,
    debounceMs,
  });

  const grouped = useMemo<GroupedResults>(() => {
    const pages: SearchResult<AppSearchItem>[] = [];
    const content: SearchResult<AppSearchItem>[] = [];

    for (const result of results) {
      const category = result.item.meta?.category;
      if (category === "page") {
        pages.push(result);
      } else if (category === "content") {
        content.push(result);
      }
    }

    return { pages, content };
  }, [results]);

  const hasResults = results.length > 0;

  return { query, setQuery, results, grouped, hasResults };
}
