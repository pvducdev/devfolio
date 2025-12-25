import Fuse, { type IFuseOptions } from "fuse.js";

import type {
  BaseSearchItem,
  SearchItem,
  SearchOptions,
  SearchResult,
} from "../core/types";
import type { IndexAdapter } from "./types";

export interface FuseIndexKey {
  name: string;
  weight: number;
}

export interface FuseAdapterOptions<TItem extends BaseSearchItem = SearchItem> {
  keys?: FuseIndexKey[];
  threshold?: number;
  fuseOptions?: Partial<IFuseOptions<TItem>>;
}

const DEFAULT_KEYS: FuseIndexKey[] = [
  { name: "title", weight: 1.0 },
  { name: "description", weight: 0.7 },
  { name: "keywords", weight: 0.5 },
];

const DEFAULT_THRESHOLD = 0.3;

export class FuseAdapter<TItem extends BaseSearchItem = SearchItem>
  implements IndexAdapter<TItem>
{
  private readonly items = new Map<string, TItem>();
  private fuse: Fuse<TItem> | null = null;
  private readonly keys: FuseIndexKey[];
  private readonly threshold: number;
  private readonly fuseOptions: Partial<IFuseOptions<TItem>>;
  private rebuildScheduled = false;

  constructor(options: FuseAdapterOptions<TItem> = {}) {
    this.keys = options.keys ?? DEFAULT_KEYS;
    this.threshold = options.threshold ?? DEFAULT_THRESHOLD;
    this.fuseOptions = options.fuseOptions ?? {};
  }

  get size(): number {
    return this.items.size;
  }

  add(items: TItem[]): void {
    for (const item of items) {
      this.items.set(item.id, item);
    }
    this.scheduleRebuild();
  }

  remove(ids: string[]): void {
    for (const id of ids) {
      this.items.delete(id);
    }
    this.scheduleRebuild();
  }

  update(items: TItem[]): void {
    for (const item of items) {
      this.items.set(item.id, item);
    }
    this.scheduleRebuild();
  }

  search(query: string, options?: SearchOptions): SearchResult<TItem>[] {
    const trimmedQuery = query.trim();

    if (this.rebuildScheduled) {
      this.rebuild();
      this.rebuildScheduled = false;
    }

    if (!this.fuse || trimmedQuery === "") {
      return [];
    }

    const limit = options?.limit ?? 20;
    const results = this.fuse.search(trimmedQuery, { limit });

    return results.map((result) => ({
      item: result.item,
      score: 1 - (result.score ?? 0),
      matches: options?.includeMatches
        ? this.mapMatches(result.matches)
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
    this.rebuildScheduled = false;
  }

  flush(): void {
    if (this.rebuildScheduled) {
      this.rebuild();
      this.rebuildScheduled = false;
    }
  }

  private scheduleRebuild(): void {
    if (this.rebuildScheduled) {
      return;
    }

    this.rebuildScheduled = true;
    queueMicrotask(() => {
      if (this.rebuildScheduled) {
        this.rebuild();
        this.rebuildScheduled = false;
      }
    });
  }

  private rebuild(): void {
    const fuseOptions: IFuseOptions<TItem> = {
      keys: this.keys.map((k) => ({
        name: k.name,
        weight: k.weight,
      })),
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
  }

  private mapMatches(
    matches: readonly Fuse.FuseResultMatch[] | undefined
  ): { key: string; value: string; indices: [number, number][] }[] | undefined {
    if (!matches) {
      return undefined;
    }

    return matches.map((m) => ({
      key: m.key ?? "",
      value: m.value ?? "",
      indices: m.indices.map(([start, end]): [number, number] => [start, end]),
    }));
  }
}

export function createFuseAdapter<TItem extends BaseSearchItem = SearchItem>(
  options?: FuseAdapterOptions<TItem>
): FuseAdapter<TItem> {
  return new FuseAdapter(options);
}
