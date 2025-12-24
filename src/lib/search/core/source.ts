import type { BaseSearchItem, SearchItem } from "./types";

export interface SearchSourceConfig {
  id: string;
  name: string;
  category: string;
  priority?: number;
}

export interface SearchSource<TItem extends BaseSearchItem = SearchItem> {
  readonly config: SearchSourceConfig;
  fetch(): TItem[] | Promise<TItem[]>;
  subscribe?(callback: (items: TItem[]) => void): () => void;
}

export class SourceRegistry<TItem extends BaseSearchItem = SearchItem> {
  private readonly sources = new Map<string, SearchSource<TItem>>();
  private readonly listeners = new Set<() => void>();

  register(source: SearchSource<TItem>): () => void {
    this.sources.set(source.config.id, source);
    this.notify();

    return () => {
      this.unregister(source.config.id);
    };
  }

  unregister(id: string): void {
    this.sources.delete(id);
    this.notify();
  }

  get(id: string): SearchSource<TItem> | undefined {
    return this.sources.get(id);
  }

  getAll(): SearchSource<TItem>[] {
    return [...this.sources.values()].sort(
      (a, b) => (b.config.priority ?? 0) - (a.config.priority ?? 0)
    );
  }

  getByCategory(category: string): SearchSource<TItem>[] {
    return this.getAll().filter((s) => s.config.category === category);
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  clear(): void {
    this.sources.clear();
    this.notify();
  }
}

export interface CreateSourceOptions<TItem extends BaseSearchItem> {
  id: string;
  name: string;
  category: string;
  priority?: number;
  fetch: () => TItem[] | Promise<TItem[]>;
  subscribe?: (callback: (items: TItem[]) => void) => () => void;
}

export function createSource<TItem extends BaseSearchItem = SearchItem>(
  options: CreateSourceOptions<TItem>
): SearchSource<TItem> {
  return {
    config: {
      id: options.id,
      name: options.name,
      category: options.category,
      priority: options.priority,
    },
    fetch: options.fetch,
    subscribe: options.subscribe,
  };
}
