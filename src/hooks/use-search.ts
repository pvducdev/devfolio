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
  { name: "title", weight: 1.0 },
  { name: "description", weight: 0.7 },
  { name: "keywords", weight: 0.5 },
] as const;

const DEFAULT_ORDER: CategoryKey[] = ["page", "skill", "career"];

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

function getBestScore(results: SearchResult<AppSearchItem>[]): number {
  if (results.length === 0) {
    return Number.POSITIVE_INFINITY;
  }
  return Math.min(...results.map((r) => r.score));
}

function sortGroupsByRelevance(
  groups: SearchResultGroup[]
): SearchResultGroup[] {
  return [...groups].sort(
    (a, b) => getBestScore(a.results) - getBestScore(b.results)
  );
}

export function useAppSearch(
  options?: UseAppSearchOptions
): UseAppSearchReturn {
  const { debounceMs } = options ?? {};

  const { query, setQuery, grouped, hasResults } = useSearch<
    AppSearchItem,
    CategoryKey
  >({
    adapter,
    data: getInitialData(),
    debounceMs,
    returnAllOnEmpty: true,
    groupBy: (item) => item.meta?.category,
  });

  const allGroups = DEFAULT_ORDER.map((key) => ({
    key,
    results: grouped[key] ?? [],
  })).filter((group) => group.results.length > 0);

  const groups = query ? sortGroupsByRelevance(allGroups) : allGroups;

  return { query, setQuery, groups, hasResults };
}
