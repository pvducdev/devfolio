import Fuse from "fuse.js";
import type { FuseResultMatch, IFuseOptions } from "fuse.js";

import type {
  BaseSearchItem,
  SearchItem,
  SearchMatch,
  SearchQueryOptions,
  SearchResult,
} from "../core/types";
import type { IndexAdapter } from "./types";

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

export interface FuseAdapterOptions<
  TItem extends BaseSearchItem = SearchItem,
> extends Omit<Partial<IFuseOptions<TItem>>, "keys"> {
  keys: FuseIndexKey<TItem>[];
}

const DEFAULT_SEARCH_LIMIT = 20;

const DEFAULT_FUSE_OPTIONS: Partial<IFuseOptions<unknown>> = {
  ignoreFieldNorm: true,
  ignoreLocation: true,
  includeMatches: true,
  includeScore: true,
  minMatchCharLength: 2,
  shouldSort: true,
  threshold: 0.4,
};

export class FuseAdapter<
  TItem extends BaseSearchItem = SearchItem,
> implements IndexAdapter<TItem> {
  private readonly items = new Map<string, TItem>();
  private fuse: Fuse<TItem> | null = null;
  private readonly options: FuseAdapterOptions<TItem>;
  private dirty = false;

  constructor(options: FuseAdapterOptions<TItem>) {
    this.options = options;
  }

  get size(): number {
    return this.items.size;
  }

  add(items: TItem[]): void {
    if (items.length === 0) {
      return;
    }

    for (const item of items) {
      const exists = this.items.has(item.id);
      this.items.set(item.id, item);

      if (this.fuse && !exists) {
        this.fuse.add(item);
      } else if (exists) {
        this.dirty = true;
      }
    }
  }

  remove(ids: string[]): void {
    if (ids.length === 0) {
      return;
    }

    for (const id of ids) {
      if (this.items.delete(id)) {
        this.dirty = true;
      }
    }
  }

  search(query: string, options?: SearchQueryOptions): SearchResult<TItem>[] {
    if (query === "") {
      return [];
    }

    this.ensureIndex();
    if (!this.fuse) {
      return [];
    }

    const results = this.fuse.search(query, {
      limit: options?.limit ?? DEFAULT_SEARCH_LIMIT,
    });

    return results.map((result) => ({
      item: result.item,
      matches: options?.includeMatches
        ? FuseAdapter.mapMatches(result.matches)
        : undefined,
      score: result.score ?? 0,
    }));
  }

  getAll(): readonly TItem[] {
    return [...this.items.values()];
  }

  get(id: string): TItem | undefined {
    return this.items.get(id);
  }

  clear(): void {
    this.items.clear();
    this.fuse = null;
    this.dirty = false;
  }

  flush(): void {
    if (this.dirty) {
      this.rebuildIndex();
    }
  }

  private ensureIndex(): void {
    if (!this.fuse || this.dirty) {
      this.rebuildIndex();
    }
  }

  private rebuildIndex(): void {
    const fuseOptions: IFuseOptions<TItem> = {
      ...DEFAULT_FUSE_OPTIONS,
      ...this.options,
    };

    this.fuse = new Fuse([...this.items.values()], fuseOptions);
    this.dirty = false;
  }

  private static mapMatches(
    matches: readonly FuseResultMatch[] | undefined
  ): SearchMatch[] | undefined {
    if (!matches) {
      return undefined;
    }

    return matches.map(
      (m): SearchMatch => ({
        indices: m.indices as unknown as [number, number][],
        key: m.key ?? "",
        value: m.value ?? "",
      })
    );
  }
}

export const createFuseAdapter = <TItem extends BaseSearchItem = SearchItem>(
  options: FuseAdapterOptions<TItem>
): FuseAdapter<TItem> => new FuseAdapter(options);
