import type { IndexAdapter } from "../adapters/types";
import type {
  BaseSearchItem,
  SearchClientOptions,
  SearchItem,
  SearchOptions,
  SearchResult,
} from "./types";

const DEFAULT_OPTIONS: SearchOptions = {
  limit: 20,
  includeMatches: false,
  returnAllOnEmpty: true,
};

export class SearchClient<TItem extends BaseSearchItem = SearchItem> {
  private readonly adapter: IndexAdapter<TItem>;

  constructor({ adapter }: SearchClientOptions<TItem>) {
    this.adapter = adapter;
  }

  add(items: TItem[]): void {
    this.adapter.add(items);
  }

  remove(ids: string[]): void {
    this.adapter.remove(ids);
  }

  search(query: string, options?: SearchOptions): SearchResult<TItem>[] {
    const merged = { ...DEFAULT_OPTIONS, ...options };

    if (!query && merged.returnAllOnEmpty) {
      const all = this.getAll().map((item) => ({ item, score: 0 }));
      return merged.limit ? all.slice(0, merged.limit) : all;
    }

    return this.adapter.search(query, merged);
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
}

export function createSearchClient<TItem extends BaseSearchItem = SearchItem>(
  options: SearchClientOptions<TItem>
): SearchClient<TItem> {
  return new SearchClient(options);
}
