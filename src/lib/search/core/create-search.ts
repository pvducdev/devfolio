import { SearchImpl } from "./search";
import type {
  BaseSearchItem,
  Search,
  SearchItem,
  SearchOptions,
} from "./types";

export function createSearch<
  TItem extends BaseSearchItem = SearchItem,
  TGroupKeys extends string = string,
>(options: SearchOptions<TItem, TGroupKeys>): Search<TItem, TGroupKeys> {
  return new SearchImpl(options);
}
