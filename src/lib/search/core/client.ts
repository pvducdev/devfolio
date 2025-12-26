import type { IndexAdapter } from "../adapters/types";
import type {
  BaseSearchItem,
  SearchClientOptions,
  SearchItem,
  SearchOptions,
  SearchResult,
} from "./types";

const DEFAULT_SEARCH_LIMIT = 20;

export class SearchClient<TItem extends BaseSearchItem = SearchItem> {
  private readonly adapter: IndexAdapter<TItem>;
  private readonly defaultOptions: SearchOptions;
  private readonly returnAllOnEmpty: boolean;

  constructor(options: SearchClientOptions<TItem>) {
    this.adapter = options.adapter;
    this.returnAllOnEmpty = options.returnAllOnEmpty ?? true;
    this.defaultOptions = {
      limit: DEFAULT_SEARCH_LIMIT,
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

    if (!query && this.returnAllOnEmpty) {
      const all = this.adapter.getAll().map((item) => ({ item, score: 1 }));
      return mergedOptions.limit ? all.slice(0, mergedOptions.limit) : all;
    }

    return this.adapter.search(query, mergedOptions);
  }

  get(id: string): TItem | undefined {
    return this.adapter.get(id);
  }

  getAll(): readonly TItem[] {
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
