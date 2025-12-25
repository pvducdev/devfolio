// biome-ignore lint/performance/noBarrelFile: Core exports
export {
  createSearchClient,
  SearchClient,
  type SearchClientOptions,
} from "./client";
export type {
  BaseSearchItem,
  SearchItem,
  SearchMatch,
  SearchOptions,
  SearchResult,
} from "./types";
