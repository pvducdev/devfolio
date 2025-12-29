import type {
  BaseSearchItem,
  GroupedResults,
  GroupFn,
  SearchResult,
} from "./types";

export function groupResults<
  TItem extends BaseSearchItem,
  TGroupKey extends string = string,
>(
  results: SearchResult<TItem>[],
  groupFn: GroupFn<TItem, TGroupKey>
): GroupedResults<TItem, TGroupKey> {
  const grouped = {} as GroupedResults<TItem, TGroupKey>;

  for (const result of results) {
    const key = groupFn(result.item);
    if (key !== undefined) {
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(result);
    }
  }

  return grouped;
}
