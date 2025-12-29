import type { IndexAdapter } from "../adapters/types";

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

export interface SearchQueryOptions {
  limit?: number;
  includeMatches?: boolean;
  returnAllOnEmpty?: boolean;
}

export type FilterFn<TItem extends BaseSearchItem = SearchItem> = (
  item: TItem
) => boolean;

export type GroupFn<
  TItem extends BaseSearchItem = SearchItem,
  TGroupKey extends string = string,
> = (item: TItem) => TGroupKey | undefined;

export type GroupedResults<
  TItem extends BaseSearchItem = SearchItem,
  TGroupKey extends string = string,
> = Record<TGroupKey, SearchResult<TItem>[]>;

export interface SearchOptions<
  TItem extends BaseSearchItem = SearchItem,
  TGroupKeys extends string = string,
> {
  adapter: IndexAdapter<TItem>;
  data?: TItem[];
  limit?: number;
  includeMatches?: boolean;
  returnAllOnEmpty?: boolean;
  filters?: FilterFn<TItem>[];
  groupBy?: GroupFn<TItem, TGroupKeys>;
}

export interface SearchResultsOutput<
  TItem extends BaseSearchItem = SearchItem,
  TGroupKeys extends string = string,
> {
  all: SearchResult<TItem>[];
  filtered: SearchResult<TItem>[];
  grouped: GroupedResults<TItem, TGroupKeys>;
}

export interface Search<
  TItem extends BaseSearchItem = SearchItem,
  TGroupKeys extends string = string,
> {
  add(items: TItem[]): void;
  remove(ids: string[]): void;
  get(id: string): TItem | undefined;
  getAll(): readonly TItem[];
  clear(): void;

  search(query: string, options?: SearchQueryOptions): SearchResult<TItem>[];

  setFilters(filters: FilterFn<TItem>[]): void;
  addFilter(filter: FilterFn<TItem>): void;
  removeFilter(index: number): void;
  getFilters(): FilterFn<TItem>[];
  getFilteredResults(results: SearchResult<TItem>[]): SearchResult<TItem>[];

  setGroupBy(groupBy: GroupFn<TItem, TGroupKeys> | undefined): void;
  getGroupBy(): GroupFn<TItem, TGroupKeys> | undefined;
  getGroupedResults(
    results: SearchResult<TItem>[]
  ): GroupedResults<TItem, TGroupKeys>;

  getResults(
    query: string,
    options?: SearchQueryOptions
  ): SearchResultsOutput<TItem, TGroupKeys>;

  readonly options: SearchOptions<TItem, TGroupKeys>;
}
