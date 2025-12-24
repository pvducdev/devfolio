// Core

// biome-ignore lint/performance/noBarrelFile: Library exports require barrel file
export {
  createFuseAdapter,
  FuseAdapter,
  type FuseAdapterOptions,
} from "./adapters/fuse";
export type {
  IndexAdapter,
  IndexAdapterOptions,
  IndexKey,
} from "./adapters/types";
export {
  type ActionContext,
  ActionError,
  type ActionErrorCode,
  type ActionHandler,
  ActionRegistry,
} from "./core/action";
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
export {
  type CreateSourceOptions,
  createSource,
  type SearchSource,
  type SearchSourceConfig,
  SourceRegistry,
} from "./core/source";
export type {
  BaseAction,
  BaseSearchItem,
  CommandAction,
  DefaultAction,
  DefaultSearchItem,
  GroupedResults,
  NavigateAction,
  SearchItem,
  SearchMatch,
  SearchOptions,
  SearchResult,
} from "./core/types";

// React
export {
  SearchProvider,
  type SearchProviderProps,
  type UseSearchActionsOptions,
  type UseSearchActionsReturn,
  type UseSearchOptions,
  type UseSearchReturn,
  useSearch,
  useSearchActions,
  useSearchClient,
} from "./react";

// Sources
export {
  createCommandsSource,
  createContentSource,
  createPagesSource,
} from "./sources";
