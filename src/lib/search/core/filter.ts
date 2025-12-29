import type { BaseSearchItem, FilterFn, SearchResult } from "./types";

export function filterResults<TItem extends BaseSearchItem>(
  results: SearchResult<TItem>[],
  filters: FilterFn<TItem>[]
): SearchResult<TItem>[] {
  if (filters.length === 0) {
    return results;
  }

  return results.filter((result) =>
    filters.every((filter) => filter(result.item))
  );
}
