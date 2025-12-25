import type { IndexAdapter } from "../adapters/types";
import { PluginManager, type SearchPlugin } from "./plugin";
import type {
  BaseSearchItem,
  SearchItem,
  SearchOptions,
  SearchResult,
} from "./types";

export interface SearchClientOptions<
  TItem extends BaseSearchItem = SearchItem,
> {
  adapter: IndexAdapter<TItem>;
  plugins?: SearchPlugin<TItem>[];
  defaultOptions?: SearchOptions;
}

export class SearchClient<TItem extends BaseSearchItem = SearchItem> {
  private readonly adapter: IndexAdapter<TItem>;
  private readonly pluginManager: PluginManager<TItem>;
  private readonly defaultOptions: SearchOptions;
  private initialized = false;

  constructor(options: SearchClientOptions<TItem>) {
    this.adapter = options.adapter;
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

  add(items: TItem[]): void {
    this.adapter.add(items);
    this.pluginManager.runItemsChange(this.adapter.getAll());
  }

  remove(ids: string[]): void {
    this.adapter.remove(ids);
    this.pluginManager.runItemsChange(this.adapter.getAll());
  }

  search(query: string, options?: SearchOptions): SearchResult<TItem>[] {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const processedOptions = this.pluginManager.runBeforeSearch(
      query,
      mergedOptions
    );

    let results: SearchResult<TItem>[];

    if (query.trim() === "") {
      results = this.adapter.getAll().map((item) => ({ item, score: 0 }));
    } else {
      results = this.adapter.search(query, processedOptions);
    }

    if (processedOptions.limit) {
      results = results.slice(0, processedOptions.limit);
    }

    return this.pluginManager.runAfterSearch(results, query);
  }

  get(id: string): TItem | undefined {
    return this.adapter.get(id);
  }

  getAll(): TItem[] {
    return this.adapter.getAll();
  }

  clear(): void {
    this.adapter.clear();
    this.pluginManager.runItemsChange([]);
  }

  getPlugins(): SearchPlugin<TItem>[] {
    return this.pluginManager.getAll();
  }

  destroy(): void {
    this.pluginManager.clear();
    this.adapter.clear();
  }
}

export function createSearchClient<TItem extends BaseSearchItem = SearchItem>(
  options: SearchClientOptions<TItem>
): SearchClient<TItem> {
  return new SearchClient(options);
}
