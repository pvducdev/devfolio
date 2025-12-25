import type {
  BaseSearchItem,
  SearchItem,
  SearchOptions,
  SearchResult,
} from "../core/types";

export interface IndexAdapter<TItem extends BaseSearchItem = SearchItem> {
  add(items: TItem[]): void;
  remove(ids: string[]): void;
  update(items: TItem[]): void;
  search(query: string, options?: SearchOptions): SearchResult<TItem>[];
  getAll(): TItem[];
  get(id: string): TItem | undefined;
  clear(): void;
  readonly size: number;
}
