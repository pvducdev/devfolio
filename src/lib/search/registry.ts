import type { SearchCategory, SearchItem } from "./types";

const items = new Map<string, SearchItem>();

export function registerSearchItem(item: SearchItem): void {
  items.set(item.id, item);
}

export function registerSearchItems(newItems: SearchItem[]): void {
  for (const item of newItems) {
    items.set(item.id, item);
  }
}

export function unregisterSearchItem(id: string): void {
  items.delete(id);
}

export function getSearchItem(id: string): SearchItem | undefined {
  return items.get(id);
}

export function getSearchItemsByCategory(
  category: SearchCategory
): SearchItem[] {
  return [...items.values()].filter((item) => item.category === category);
}

export function getAllSearchItems(): SearchItem[] {
  return [...items.values()];
}

export function getStaticSearchItems(): SearchItem[] {
  return [...items.values()].filter((item) => !item.isDynamic);
}

export function clearSearchRegistry(): void {
  items.clear();
}
