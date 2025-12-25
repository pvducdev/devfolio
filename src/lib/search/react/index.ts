// biome-ignore lint/performance/noBarrelFile: React adapter exports
export {
  SearchProvider,
  type SearchProviderProps,
  useSearchClient,
} from "./provider";
export type {
  AppAction,
  AppSearchItem,
  AppSearchMeta,
  CommandAction,
  NavigateAction,
} from "./types";
export {
  type GroupedResults,
  type UseSearchOptions,
  type UseSearchReturn,
  useSearch,
} from "./use-search";
