import Fuse, { type IFuseOptions } from "fuse.js";

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

let fuseInstance: Fuse<SearchItem> | null = null;

export function initSearchEngine(items: SearchItem[]): void {
  fuseInstance = new Fuse(items, FUSE_OPTIONS);
}

export function search(query: string, limit = 20): SearchResult[] {
  if (fuseInstance === null || query.trim() === "") {
    return [];
  }

  const results = fuseInstance.search(query, { limit });

  return results.map((result) => ({
    item: result.item,
    score: result.score ?? 0,
  }));
}

export function searchGrouped(query: string, limit = 20): GroupedResults {
  const results = search(query, limit);

  return {
    pages: results.filter((r) => r.item.category === "page"),
    commands: results.filter((r) => r.item.category === "command"),
    content: results.filter((r) => r.item.category === "content"),
  };
}

export function getAllGrouped(items: SearchItem[]): GroupedResults {
  return {
    pages: items
      .filter((i) => i.category === "page")
      .map((item) => ({ item, score: 0 })),
    commands: items
      .filter((i) => i.category === "command")
      .map((item) => ({ item, score: 0 })),
    content: items
      .filter((i) => i.category === "content")
      .map((item) => ({ item, score: 0 })),
  };
}
