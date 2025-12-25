export interface BaseSearchItem {
  id: string;
  title: string;
  description?: string;
  keywords?: string[];
}

export interface SearchItem<
  TMeta extends Record<string, unknown> = Record<string, unknown>,
> extends BaseSearchItem {
  meta?: TMeta;
}

export interface SearchResult<TItem extends BaseSearchItem = SearchItem> {
  item: TItem;
  score: number;
  matches?: SearchMatch[];
}

export interface SearchMatch {
  key: string;
  value: string;
  indices: [number, number][];
}

export interface SearchOptions {
  limit?: number;
  includeMatches?: boolean;
}
