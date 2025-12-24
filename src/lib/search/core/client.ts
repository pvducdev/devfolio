import { createFuseAdapter, type FuseAdapterOptions } from "../adapters/fuse";
import type { IndexAdapter } from "../adapters/types";
import {
  type ActionContext,
  type ActionHandler,
  ActionRegistry,
} from "./action";
import { PluginManager, type SearchPlugin } from "./plugin";
import { type SearchSource, SourceRegistry } from "./source";
import type {
  BaseAction,
  BaseSearchItem,
  GroupedResults,
  SearchItem,
  SearchOptions,
  SearchResult,
} from "./types";

export interface SearchClientOptions<
  TItem extends BaseSearchItem = SearchItem,
> {
  adapter?: IndexAdapter<TItem>;
  fuseOptions?: FuseAdapterOptions<TItem>;
  sources?: SearchSource<TItem>[];
  plugins?: SearchPlugin<TItem>[];
  defaultOptions?: SearchOptions;
}

export class SearchClient<TItem extends BaseSearchItem = SearchItem> {
  private readonly adapter: IndexAdapter<TItem>;
  private readonly sourceRegistry: SourceRegistry<TItem>;
  private readonly actionRegistry: ActionRegistry;
  private readonly pluginManager: PluginManager<TItem>;
  private readonly defaultOptions: SearchOptions;
  private readonly sourceCleanups = new Map<string, () => void>();
  private initialized = false;

  constructor(options: SearchClientOptions<TItem> = {}) {
    this.adapter =
      options.adapter ?? createFuseAdapter<TItem>(options.fuseOptions);
    this.sourceRegistry = new SourceRegistry();
    this.actionRegistry = new ActionRegistry();
    this.pluginManager = new PluginManager();
    this.defaultOptions = {
      limit: 20,
      threshold: 0.3,
      ...options.defaultOptions,
    };

    if (options.plugins) {
      for (const plugin of options.plugins) {
        this.use(plugin);
      }
    }

    if (options.sources) {
      for (const source of options.sources) {
        this.addSource(source);
      }
    }

    this.initialize();
  }

  private initialize(): void {
    if (this.initialized) {
      return;
    }

    this.pluginManager.runInit({
      getItems: () => this.adapter.getAll(),
      search: (query, options) => this.search(query, options),
    });

    this.initialized = true;
  }

  use(plugin: SearchPlugin<TItem>): this {
    this.pluginManager.use(plugin);
    return this;
  }

  removePlugin(name: string): void {
    this.pluginManager.remove(name);
  }

  addSource(source: SearchSource<TItem>): () => void {
    const cleanup = this.sourceRegistry.register(source);
    this.loadSource(source);
    this.pluginManager.runSourceRegister(source);

    const unsubscribe = source.subscribe?.((items) => {
      this.reloadSource(source.config.id, items);
    });

    const fullCleanup = () => {
      cleanup();
      unsubscribe?.();
      this.pluginManager.runSourceUnregister(source.config.id);
    };

    this.sourceCleanups.set(source.config.id, fullCleanup);

    return fullCleanup;
  }

  removeSource(id: string): void {
    const cleanup = this.sourceCleanups.get(id);
    if (cleanup) {
      cleanup();
      this.sourceCleanups.delete(id);
    }
    this.removeItemsBySource(id);
  }

  private async loadSource(source: SearchSource<TItem>): Promise<void> {
    try {
      const items = await source.fetch();
      this.adapter.add(items);
      this.pluginManager.runItemsChange(this.adapter.getAll());
    } catch (error) {
      console.error(`Failed to load source ${source.config.id}:`, error);
    }
  }

  private reloadSource(sourceId: string, items: TItem[]): void {
    this.removeItemsBySource(sourceId);
    this.adapter.add(items);
    this.pluginManager.runItemsChange(this.adapter.getAll());
  }

  private removeItemsBySource(sourceId: string): void {
    const items = this.adapter.getAll();
    const idsToRemove = items
      .filter((item) => item.id.startsWith(`${sourceId}:`))
      .map((item) => item.id);
    this.adapter.remove(idsToRemove);
  }

  registerAction<TAction extends BaseAction>(
    handler: ActionHandler<TAction>
  ): () => void {
    return this.actionRegistry.register(handler);
  }

  async executeAction(
    item: TItem & { action: BaseAction },
    context: ActionContext
  ): Promise<void> {
    const shouldContinue = this.pluginManager.runBeforeAction(
      item.action,
      item
    );
    if (!shouldContinue) {
      return;
    }

    await this.actionRegistry.execute(item.action, context);

    this.pluginManager.runAfterAction(item.action, item);
    context.close?.();
  }

  search(query: string, options?: SearchOptions): SearchResult<TItem>[] {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const processedOptions = this.pluginManager.runBeforeSearch(
      query,
      mergedOptions
    );

    let results: SearchResult<TItem>[];

    if (query.trim() === "") {
      results = this.adapter
        .getAll()
        .filter((item) => !("isDynamic" in item && item.isDynamic))
        .map((item) => ({ item, score: 0 }));
    } else {
      results = this.adapter.search(query, processedOptions);
    }

    if (processedOptions.categories?.length) {
      results = results.filter(
        (r) =>
          "category" in r.item &&
          processedOptions.categories?.includes(r.item.category as string)
      );
    }

    if (processedOptions.limit) {
      results = results.slice(0, processedOptions.limit);
    }

    return this.pluginManager.runAfterSearch(results, query);
  }

  searchGrouped(query: string, options?: SearchOptions): GroupedResults<TItem> {
    const results = this.search(query, options);
    const grouped: GroupedResults<TItem> = {};

    for (const result of results) {
      const category =
        "category" in result.item
          ? (result.item.category as string)
          : "default";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(result);
    }

    return grouped;
  }

  get(id: string): TItem | undefined {
    return this.adapter.get(id);
  }

  getAll(): TItem[] {
    return this.adapter.getAll();
  }

  getStatic(): TItem[] {
    return this.adapter
      .getAll()
      .filter((item) => !("isDynamic" in item && item.isDynamic));
  }

  registerItems(items: TItem[]): void {
    this.adapter.add(items);
    this.pluginManager.runItemsChange(this.adapter.getAll());
  }

  unregisterItems(ids: string[]): void {
    this.adapter.remove(ids);
    this.pluginManager.runItemsChange(this.adapter.getAll());
  }

  getSources(): SearchSource<TItem>[] {
    return this.sourceRegistry.getAll();
  }

  getPlugins(): SearchPlugin<TItem>[] {
    return this.pluginManager.getAll();
  }

  destroy(): void {
    for (const cleanup of this.sourceCleanups.values()) {
      cleanup();
    }
    this.sourceCleanups.clear();
    this.pluginManager.clear();
    this.sourceRegistry.clear();
    this.adapter.clear();
  }
}

export function createSearchClient<TItem extends BaseSearchItem = SearchItem>(
  options?: SearchClientOptions<TItem>
): SearchClient<TItem> {
  return new SearchClient(options);
}
