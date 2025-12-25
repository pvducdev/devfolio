import Fuse, { type IFuseOptions } from "fuse.js";

import {
  createSearchClient,
  type SearchClient,
  type SearchClientOptions,
} from "../core/client";
import type {
  BaseSearchItem,
  SearchItem,
  SearchOptions,
  SearchResult,
} from "../core/types";
import {
  DEFAULT_INDEX_OPTIONS,
  type IndexAdapter,
  type IndexAdapterOptions,
} from "./types";

export interface FuseAdapterOptions<TItem extends BaseSearchItem = SearchItem>
  extends IndexAdapterOptions {
  fuseOptions?: Partial<IFuseOptions<TItem>>;
}

export class FuseAdapter<TItem extends BaseSearchItem = SearchItem>
  implements IndexAdapter<TItem>
{
  private readonly items = new Map<string, TItem>();
  private fuse: Fuse<TItem> | null = null;
  private readonly options: Required<IndexAdapterOptions>;
  private readonly fuseOptions: Partial<IFuseOptions<TItem>>;

  constructor(options: FuseAdapterOptions<TItem> = {}) {
    this.options = {
      keys: options.keys ?? DEFAULT_INDEX_OPTIONS.keys,
      threshold: options.threshold ?? DEFAULT_INDEX_OPTIONS.threshold,
    };
    this.fuseOptions = options.fuseOptions ?? {};
  }

  add(items: TItem[]): void {
    for (const item of items) {
      this.items.set(item.id, item);
    }
    this.rebuild();
  }

  remove(ids: string[]): void {
    for (const id of ids) {
      this.items.delete(id);
    }
    this.rebuild();
  }

  update(items: TItem[]): void {
    for (const item of items) {
      this.items.set(item.id, item);
    }
    this.rebuild();
  }

  search(query: string, options?: SearchOptions): SearchResult<TItem>[] {
    if (!this.fuse || query.trim() === "") {
      return [];
    }

    const limit = options?.limit ?? 20;
    const results = this.fuse.search(query, { limit });

    return results.map((result) => ({
      item: result.item,
      score: result.score ?? 0,
      matches: options?.includeMatches
        ? result.matches?.map((m) => ({
            key: m.key ?? "",
            value: m.value ?? "",
            indices: m.indices as [number, number][],
          }))
        : undefined,
    }));
  }

  getAll(): TItem[] {
    return [...this.items.values()];
  }

  get(id: string): TItem | undefined {
    return this.items.get(id);
  }

  clear(): void {
    this.items.clear();
    this.fuse = null;
  }

  rebuild(): void {
    const fuseOptions: IFuseOptions<TItem> = {
      keys: this.options.keys.map((k) => ({
        name: k.name,
        weight: k.weight,
      })),
      threshold: this.options.threshold,
      isCaseSensitive: false,
      ignoreLocation: true,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 1,
      distance: 100,
      ...this.fuseOptions,
    };

    this.fuse = new Fuse([...this.items.values()], fuseOptions);
  }
}

export function createFuseAdapter<TItem extends BaseSearchItem = SearchItem>(
  options?: FuseAdapterOptions<TItem>
): FuseAdapter<TItem> {
  return new FuseAdapter(options);
}

export interface FuseSearchClientOptions<
  TItem extends BaseSearchItem = SearchItem,
> extends Omit<SearchClientOptions<TItem>, "adapter"> {
  adapterOptions?: FuseAdapterOptions<TItem>;
}

export function createFuseSearchClient<
  TItem extends BaseSearchItem = SearchItem,
>(options: FuseSearchClientOptions<TItem> = {}): SearchClient<TItem> {
  const { adapterOptions, ...clientOptions } = options;
  return createSearchClient({
    ...clientOptions,
    adapter: createFuseAdapter<TItem>(adapterOptions),
  });
}
