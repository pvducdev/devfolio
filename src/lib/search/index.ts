// Adapters
// biome-ignore lint/performance/noBarrelFile: Library exports
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

// Core
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

// React adapter
export {
  type GroupedResults,
  type UseSearchOptions,
  type UseSearchReturn,
  useSearch,
} from "./react";

// App-specific sources (item builders and types)
export {
  type AppAction,
  type AppSearchItem,
  type AppSearchMeta,
  buildCommandItems,
  buildContentItems,
  buildPageItems,
  type CommandAction,
  type NavigateAction,
} from "./sources";
