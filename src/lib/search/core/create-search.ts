import { SearchImpl } from "./search";
import type {
  BaseSearchItem,
  Search,
  SearchItem,
  SearchOptions,
} from "./types";

export const createSearch = <
  TItem extends BaseSearchItem = SearchItem,
  TGroupKeys extends string = string,
>(
  options: SearchOptions<TItem, TGroupKeys>
): Search<TItem, TGroupKeys> => new SearchImpl(options);
