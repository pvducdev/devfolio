import type {
  BaseSearchItem,
  SearchClient,
  SearchItem,
  SearchOptions,
  SearchResult,
} from "../core";

export interface UseSearchOptions<TItem extends BaseSearchItem = SearchItem>
  extends SearchOptions {
  client: SearchClient<TItem>;
  debounceMs?: number;
}

export interface UseSearchReturn<TItem extends BaseSearchItem = SearchItem> {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult<TItem>[];
}
