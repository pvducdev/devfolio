import type { IndexAdapter } from "../adapters/types";
import type {
  BaseSearchItem,
  SearchItem,
  SearchOptions,
  SearchResult,
} from "./types";

export interface SearchClientOptions<
  TItem extends BaseSearchItem = SearchItem,
> {
  adapter: IndexAdapter<TItem>;
  defaultOptions?: SearchOptions;
  returnAllOnEmpty?: boolean;
}

export class SearchClient<TItem extends BaseSearchItem = SearchItem> {
  private readonly adapter: IndexAdapter<TItem>;
  private readonly defaultOptions: SearchOptions;
  private readonly returnAllOnEmpty: boolean;

  constructor(options: SearchClientOptions<TItem>) {
    this.adapter = options.adapter;
    this.returnAllOnEmpty = options.returnAllOnEmpty ?? true;
    this.defaultOptions = {
      limit: 20,
      ...options.defaultOptions,
    };
  }

  add(items: TItem[]): void {
    this.adapter.add(items);
  }

  remove(ids: string[]): void {
    this.adapter.remove(ids);
  }

  search(query: string, options?: SearchOptions): SearchResult<TItem>[] {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const isEmptyQuery = query.trim() === "";

    let results: SearchResult<TItem>[];
    if (isEmptyQuery && this.returnAllOnEmpty) {
      results = this.adapter.getAll().map((item) => ({ item, score: 1 }));
    } else {
      results = this.adapter.search(query, mergedOptions);
    }

    if (mergedOptions.limit) {
      results = results.slice(0, mergedOptions.limit);
    }

    return results;
  }

  get(id: string): TItem | undefined {
    return this.adapter.get(id);
  }

  getAll(): TItem[] {
    return this.adapter.getAll();
  }

  clear(): void {
    this.adapter.clear();
  }

  destroy(): void {
    this.adapter.clear();
  }
}

export function createSearchClient<TItem extends BaseSearchItem = SearchItem>(
  options: SearchClientOptions<TItem>
): SearchClient<TItem> {
  return new SearchClient(options);
}
