import Fuse, { type FuseResultMatch, type IFuseOptions } from "fuse.js";

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

export interface FuseAdapterOptions<TItem extends BaseSearchItem = SearchItem>
  extends Omit<Partial<IFuseOptions<TItem>>, "keys"> {
  keys: FuseIndexKey<TItem>[];
}

const DEFAULT_SEARCH_LIMIT = 20;

const DEFAULT_FUSE_OPTIONS: Partial<IFuseOptions<unknown>> = {
  includeScore: true,
  includeMatches: true,
  // Ignore pattern position - match anywhere in the field
  ignoreLocation: true,
  // Fuzzy matching sensitivity: 0 = exact, 1 = match anything
  // 0.4 provides good balance for search UX
  threshold: 0.4,
  // Minimum characters to trigger a match (filter out single chars)
  minMatchCharLength: 2,
  // Results are sorted by score
  shouldSort: true,
  // Don't penalize longer fields - existence matters more than frequency
  ignoreFieldNorm: true,
};

export class FuseAdapter<TItem extends BaseSearchItem = SearchItem>
  implements IndexAdapter<TItem>
{
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
      score: result.score ?? 0,
      matches: options?.includeMatches
        ? this.mapMatches(result.matches)
        : undefined,
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

  private mapMatches(
    matches: readonly FuseResultMatch[] | undefined
  ): SearchMatch[] | undefined {
    if (!matches) {
      return undefined;
    }

    return matches.map(
      (m): SearchMatch => ({
        key: m.key ?? "",
        value: m.value ?? "",
        indices: m.indices as unknown as [number, number][],
      })
    );
  }
}

export function createFuseAdapter<TItem extends BaseSearchItem = SearchItem>(
  options: FuseAdapterOptions<TItem>
): FuseAdapter<TItem> {
  return new FuseAdapter(options);
}
