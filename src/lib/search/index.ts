// Core

// biome-ignore lint/performance/noBarrelFile: Library exports require barrel file
export {
  createFuseAdapter,
  createFuseSearchClient,
  FuseAdapter,
  type FuseAdapterOptions,
  type FuseSearchClientOptions,
} from "./adapters/fuse";
export type {
  IndexAdapter,
  IndexAdapterOptions,
  IndexKey,
} from "./adapters/types";
export {
  createSearchClient,
  SearchClient,
  type SearchClientOptions,
} from "./core/client";
export {
  createPlugin,
  type PluginContext,
  PluginManager,
  type SearchPlugin,
} from "./core/plugin";
export type {
  BaseSearchItem,
  SearchItem,
  SearchMatch,
  SearchOptions,
  SearchResult,
} from "./core/types";

// React
export {
  type AppAction,
  type AppSearchItem,
  type AppSearchMeta,
  type CommandAction,
  type GroupedResults,
  type NavigateAction,
  SearchProvider,
  type SearchProviderProps,
  type UseSearchOptions,
  type UseSearchReturn,
  useSearch,
  useSearchClient,
} from "./react";

// Item Builders
export {
  buildCommandItems,
  buildContentItems,
  buildPageItems,
} from "./sources";
