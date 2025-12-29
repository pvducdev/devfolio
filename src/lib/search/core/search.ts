import type { IndexAdapter } from "../adapters/types";
import { filterResults } from "./filter";
import { groupResults } from "./group";
import type {
  BaseSearchItem,
  FilterFn,
  GroupedResults,
  GroupFn,
  Search,
  SearchItem,
  SearchOptions,
  SearchQueryOptions,
  SearchResult,
  SearchResultsOutput,
} from "./types";

const DEFAULT_QUERY_OPTIONS: SearchQueryOptions = {
  limit: 20,
  includeMatches: false,
  returnAllOnEmpty: true,
};

export class SearchImpl<
  TItem extends BaseSearchItem = SearchItem,
  TGroupKeys extends string = string,
> implements Search<TItem, TGroupKeys>
{
  private readonly adapter: IndexAdapter<TItem>;
  private filters: FilterFn<TItem>[] = [];
  private groupBy: GroupFn<TItem, TGroupKeys> | undefined;

  readonly options: SearchOptions<TItem, TGroupKeys>;

  constructor(options: SearchOptions<TItem, TGroupKeys>) {
    this.options = options;
    this.adapter = options.adapter;

    if (options.filters) {
      this.filters = [...options.filters];
    }
    if (options.groupBy) {
      this.groupBy = options.groupBy;
    }
    if (options.data) {
      this.add(options.data);
    }
  }

  add(items: TItem[]): void {
    this.adapter.add(items);
  }

  remove(ids: string[]): void {
    this.adapter.remove(ids);
  }

  get(id: string): TItem | undefined {
    return this.adapter.get(id);
  }

  getAll(): readonly TItem[] {
    return this.adapter.getAll();
  }

  clear(): void {
    this.adapter.clear();
  }

  search(query: string, options?: SearchQueryOptions): SearchResult<TItem>[] {
    const merged: SearchQueryOptions = {
      ...DEFAULT_QUERY_OPTIONS,
      ...this.options,
      ...options,
    };

    if (!query && merged.returnAllOnEmpty) {
      const all = this.getAll().map((item) => ({ item, score: 0 }));
      return merged.limit ? all.slice(0, merged.limit) : all;
    }

    return this.adapter.search(query, merged);
  }

  setFilters(filters: FilterFn<TItem>[]): void {
    this.filters = [...filters];
  }

  addFilter(filter: FilterFn<TItem>): void {
    this.filters.push(filter);
  }

  removeFilter(index: number): void {
    if (index >= 0 && index < this.filters.length) {
      this.filters.splice(index, 1);
    }
  }

  getFilters(): FilterFn<TItem>[] {
    return [...this.filters];
  }

  getFilteredResults(results: SearchResult<TItem>[]): SearchResult<TItem>[] {
    return filterResults(results, this.filters);
  }

  setGroupBy(groupBy: GroupFn<TItem, TGroupKeys> | undefined): void {
    this.groupBy = groupBy;
  }

  getGroupBy(): GroupFn<TItem, TGroupKeys> | undefined {
    return this.groupBy;
  }

  getGroupedResults(
    results: SearchResult<TItem>[]
  ): GroupedResults<TItem, TGroupKeys> {
    if (!this.groupBy) {
      return {} as GroupedResults<TItem, TGroupKeys>;
    }
    return groupResults(results, this.groupBy);
  }

  getResults(
    query: string,
    options?: SearchQueryOptions
  ): SearchResultsOutput<TItem, TGroupKeys> {
    const all = this.search(query, options);
    const filtered = this.getFilteredResults(all);
    const grouped = this.getGroupedResults(filtered);

    return { all, filtered, grouped };
  }
}
