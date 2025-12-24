import type {
  BaseSearchItem,
  SearchItem,
  SearchOptions,
  SearchResult,
} from "../core/types";

export interface IndexAdapterOptions {
  keys?: IndexKey[];
  threshold?: number;
}

export interface IndexKey {
  name: string;
  weight: number;
}

export interface IndexAdapter<TItem extends BaseSearchItem = SearchItem> {
  add(items: TItem[]): void;
  remove(ids: string[]): void;
  update(items: TItem[]): void;
  search(query: string, options?: SearchOptions): SearchResult<TItem>[];
  getAll(): TItem[];
  get(id: string): TItem | undefined;
  clear(): void;
  rebuild(): void;
}

export const DEFAULT_INDEX_KEYS: IndexKey[] = [
  { name: "title", weight: 1.0 },
  { name: "description", weight: 0.7 },
  { name: "keywords", weight: 0.5 },
];

export const DEFAULT_INDEX_OPTIONS: Required<IndexAdapterOptions> = {
  keys: DEFAULT_INDEX_KEYS,
  threshold: 0.3,
};
