import Fuse, { type IFuseOptions } from "fuse.js";

import { buildCommandItems } from "./sources/commands";
import { buildContentItems } from "./sources/content";
import { buildPageItems } from "./sources/pages";
import type { GroupedResults, SearchItem, SearchResult } from "./types";

const FUSE_OPTIONS: IFuseOptions<SearchItem> = {
  keys: [
    { name: "title", weight: 1.0 },
    { name: "description", weight: 0.7 },
    { name: "keywords", weight: 0.5 },
  ],
  isCaseSensitive: false,
  threshold: 0.3,
  ignoreLocation: true,
  includeScore: true,
  minMatchCharLength: 1,
  distance: 100,
};

export class SearchService {
  private readonly items = new Map<string, SearchItem>();
  private fuseInstance: Fuse<SearchItem> | null = null;

  register(newItems: SearchItem[]): void {
    for (const item of newItems) {
      this.items.set(item.id, item);
    }
    this.rebuildIndex();
  }

  unregister(id: string): void {
    this.items.delete(id);
    this.rebuildIndex();
  }

  get(id: string): SearchItem | undefined {
    return this.items.get(id);
  }

  getAll(): SearchItem[] {
    return [...this.items.values()];
  }

  getStatic(): SearchItem[] {
    return [...this.items.values()].filter((item) => !item.isDynamic);
  }

  search(query: string, limit = 20): SearchResult[] {
    if (!this.fuseInstance || query.trim() === "") {
      return [];
    }

    return this.fuseInstance.search(query, { limit }).map((result) => ({
      item: result.item,
      score: result.score ?? 0,
    }));
  }

  searchGrouped(query: string, limit = 20): GroupedResults {
    const results = this.search(query, limit);
    return this.groupResults(results);
  }

  getAllGrouped(): GroupedResults {
    const results = this.getStatic().map((item) => ({ item, score: 0 }));
    return this.groupResults(results);
  }

  clear(): void {
    this.items.clear();
    this.fuseInstance = null;
  }

  private rebuildIndex(): void {
    this.fuseInstance = new Fuse([...this.items.values()], FUSE_OPTIONS);
  }

  private groupResults(results: SearchResult[]): GroupedResults {
    return {
      pages: results.filter((r) => r.item.category === "page"),
      commands: results.filter((r) => r.item.category === "command"),
      content: results.filter((r) => r.item.category === "content"),
    };
  }
}

export function createSearchService(): SearchService {
  const service = new SearchService();
  service.register([
    ...buildPageItems(),
    ...buildCommandItems(),
    ...buildContentItems(),
  ]);
  return service;
}
