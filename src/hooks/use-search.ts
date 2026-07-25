import {
  buildCareerItems,
  buildPageItems,
  buildSkillItems,
} from "@/config/search";
import type { AppSearchItem } from "@/config/search";
import { createFuseAdapter } from "@/lib/search/adapters";
import type { SearchResult } from "@/lib/search/core";
import { useSearch } from "@/lib/search/react";

interface UseAppSearchOptions {
  debounceMs?: number;
}

export type CategoryKey = "page" | "skill" | "career";

export interface SearchResultGroup {
  key: CategoryKey;
  results: SearchResult<AppSearchItem>[];
}

interface UseAppSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  groups: SearchResultGroup[];
  hasResults: boolean;
}

const SEARCH_KEYS = [
  { name: "title", weight: 1 },
  { name: "description", weight: 0.7 },
  { name: "keywords", weight: 0.5 },
] as const;

const DEFAULT_ORDER: CategoryKey[] = ["page", "skill", "career"];

const adapter = createFuseAdapter<AppSearchItem>({ keys: [...SEARCH_KEYS] });

let cachedData: AppSearchItem[] | null = null;

const getInitialData = (): AppSearchItem[] => {
  if (!cachedData) {
    cachedData = [
      ...buildPageItems(),
      ...buildSkillItems(),
      ...buildCareerItems(),
    ];
  }
  return cachedData;
};

const getBestScore = (results: SearchResult<AppSearchItem>[]): number => {
  if (results.length === 0) {
    return Number.POSITIVE_INFINITY;
  }
  return Math.min(...results.map((r) => r.score));
};

const sortGroupsByRelevance = (
  groups: SearchResultGroup[]
): SearchResultGroup[] =>
  [...groups].toSorted(
    (a, b) => getBestScore(a.results) - getBestScore(b.results)
  );

export const useAppSearch = (
  options?: UseAppSearchOptions
): UseAppSearchReturn => {
  const { debounceMs } = options ?? {};

  const { query, setQuery, grouped, hasResults } = useSearch<
    AppSearchItem,
    CategoryKey
  >({
    adapter,
    data: getInitialData(),
    debounceMs,
    groupBy: (item) => item.meta?.category,
    returnAllOnEmpty: true,
  });

  const allGroups = DEFAULT_ORDER.map((key) => ({
    key,
    results: grouped[key] ?? [],
  })).filter((group) => group.results.length > 0);

  const groups = query ? sortGroupsByRelevance(allGroups) : allGroups;

  return { groups, hasResults, query, setQuery };
};
