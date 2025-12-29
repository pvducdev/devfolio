import type {
  BaseSearchItem,
  GroupedResults,
  Search,
  SearchItem,
  SearchOptions,
  SearchResult,
} from "../core";

export interface UseSearchOptions<
  TItem extends BaseSearchItem = SearchItem,
  TGroupKeys extends string = string,
> extends Omit<SearchOptions<TItem, TGroupKeys>, "data"> {
  data?: TItem[];
  debounceMs?: number;
}

export interface UseSearchReturn<
  TItem extends BaseSearchItem = SearchItem,
  TGroupKeys extends string = string,
> {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult<TItem>[];
  filtered: SearchResult<TItem>[];
  grouped: GroupedResults<TItem, TGroupKeys>;
  hasResults: boolean;
  search: Search<TItem, TGroupKeys>;
}
