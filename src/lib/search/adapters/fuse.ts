import Fuse, { type FuseResultMatch, type IFuseOptions } from "fuse.js";

import type {
  BaseSearchItem,
  SearchItem,
  SearchMatch,
  SearchOptions,
  SearchResult,
} from "../core/types";
import type { FuseAdapterOptions, FuseIndexKey, IndexAdapter } from "./types";

const DEFAULT_THRESHOLD = 0.3;
const DEFAULT_SEARCH_LIMIT = 20;

export class FuseAdapter<TItem extends BaseSearchItem = SearchItem>
  implements IndexAdapter<TItem>
{
  private readonly items = new Map<string, TItem>();
  private fuse: Fuse<TItem> | null = null;
  private readonly keys: FuseIndexKey<TItem>[];
  private readonly threshold: number;
  private readonly fuseOptions: Partial<IFuseOptions<TItem>>;
  private dirty = false;

  constructor(options: FuseAdapterOptions<TItem>) {
    this.keys = options.keys;
    this.threshold = options.threshold ?? DEFAULT_THRESHOLD;
    this.fuseOptions = options.fuseOptions ?? {};
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

  search(query: string, options?: SearchOptions): SearchResult<TItem>[] {
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
      score: 1 - (result.score ?? 0),
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
      keys: this.keys,
      threshold: this.threshold,
      isCaseSensitive: false,
      ignoreLocation: true,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 1,
      distance: 100,
      ...this.fuseOptions,
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
