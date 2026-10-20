import Fuse from "fuse.js";
import type { IFuseOptions } from "fuse.js";
import { useState } from "react";

import { buildSearchItems } from "./items";
import type { SearchCategory, SearchItem } from "./items";

export interface SearchResultGroup {
  category: SearchCategory;
  items: SearchItem[];
}

const FUSE_OPTIONS: IFuseOptions<SearchItem> = {
  ignoreFieldNorm: true,
  ignoreLocation: true,
  keys: [
    { name: "title", weight: 1 },
    { name: "description", weight: 0.7 },
    { name: "keywords", weight: 0.5 },
  ],
  minMatchCharLength: 2,
  threshold: 0.4,
};

const groupByCategory = (items: SearchItem[]): SearchResultGroup[] => {
  const groups = new Map<SearchCategory, SearchItem[]>();
  for (const item of items) {
    groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
  }
  return [...groups].map(([category, grouped]) => ({
    category,
    items: grouped,
  }));
};

export const useSearch = () => {
  const [items] = useState(buildSearchItems);
  const [fuse] = useState(() => new Fuse(items, FUSE_OPTIONS));
  const [query, setQuery] = useState("");

  const matches = query ? fuse.search(query).map(({ item }) => item) : items;

  return { groups: groupByCategory(matches), query, setQuery };
};
