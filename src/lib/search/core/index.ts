// biome-ignore-all lint/performance/noBarrelFile: Core exports

export { createSearch } from "./create-search";
export { filterResults } from "./filter";
export { groupResults } from "./group";
export { SearchImpl } from "./search";
export type {
  BaseSearchItem,
  FilterFn,
  GroupedResults,
  GroupFn,
  Search,
  SearchItem,
  SearchMatch,
  SearchOptions,
  SearchQueryOptions,
  SearchResult,
  SearchResultsOutput,
} from "./types";
