import type { IFuseOptions } from "fuse.js";
import type {
  BaseSearchItem,
  SearchItem,
  SearchOptions,
  SearchResult,
} from "../core/types";

type DeepKeys<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? K | `${K}.${DeepKeys<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

export interface FuseIndexKey<TItem> {
  name: DeepKeys<TItem>;
  weight: number;
}

export interface FuseAdapterOptions<TItem extends BaseSearchItem = SearchItem>
  extends Omit<Partial<IFuseOptions<TItem>>, "keys"> {
  keys: FuseIndexKey<TItem>[];
}

export interface IndexAdapter<TItem extends BaseSearchItem = SearchItem> {
  add(items: TItem[]): void;
  remove(ids: string[]): void;
  search(query: string, options?: SearchOptions): SearchResult<TItem>[];
  getAll(): readonly TItem[];
  get(id: string): TItem | undefined;
  clear(): void;
  flush(): void;
  readonly size: number;
}
