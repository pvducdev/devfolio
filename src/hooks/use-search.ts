import {
  type AppSearchItem,
  buildCareerItems,
  buildPageItems,
  buildSkillItems,
} from "@/config/search";
import { createFuseAdapter } from "@/lib/search/adapters";
import type { SearchResult } from "@/lib/search/core";
import { useSearch } from "@/lib/search/react";

interface UseAppSearchOptions {
  debounceMs?: number;
}

interface GroupedResults {
  page: SearchResult<AppSearchItem>[];
  skill: SearchResult<AppSearchItem>[];
  career: SearchResult<AppSearchItem>[];
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

type CategoryKeys = "page" | "skill" | "career";

const adapter = createFuseAdapter<AppSearchItem>({ keys: [...SEARCH_KEYS] });

let cachedData: AppSearchItem[] | null = null;

function getInitialData(): AppSearchItem[] {
  if (!cachedData) {
    cachedData = [
      ...buildPageItems(),
      ...buildSkillItems(),
      ...buildCareerItems(),
    ];
  }
  return cachedData;
}

export function useAppSearch(
  options?: UseAppSearchOptions
): UseAppSearchReturn {
  const { debounceMs } = options ?? {};

  const { query, setQuery, filtered, grouped, hasResults } = useSearch<
    AppSearchItem,
    CategoryKeys
  >({
    adapter,
    data: getInitialData(),
    debounceMs,
    returnAllOnEmpty: true,
    groupBy: (item) => item.meta?.category,
  });

  return {
    query,
    setQuery,
    results: filtered,
    grouped: {
      page: grouped.page ?? [],
      skill: grouped.skill ?? [],
      career: grouped.career ?? [],
    },
    hasResults,
  };
}
