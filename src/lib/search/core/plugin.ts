import type { SearchSource } from "./source";
import type {
  BaseAction,
  BaseSearchItem,
  SearchItem,
  SearchOptions,
  SearchResult,
} from "./types";

export interface SearchPlugin<TItem extends BaseSearchItem = SearchItem> {
  name: string;

  onInit?(context: PluginContext<TItem>): void;
  onDestroy?(): void;

  onBeforeSearch?(query: string, options: SearchOptions): SearchOptions;
  onAfterSearch?(
    results: SearchResult<TItem>[],
    query: string
  ): SearchResult<TItem>[];

  onSourceRegister?(source: SearchSource<TItem>): void;
  onSourceUnregister?(sourceId: string): void;

  onBeforeAction?(action: BaseAction, item: TItem): boolean;
  onAfterAction?(action: BaseAction, item: TItem): void;

  onItemsChange?(items: TItem[]): void;
}

export interface PluginContext<TItem extends BaseSearchItem = SearchItem> {
  getItems(): TItem[];
  search(query: string, options?: SearchOptions): SearchResult<TItem>[];
}

export class PluginManager<TItem extends BaseSearchItem = SearchItem> {
  private readonly plugins = new Map<string, SearchPlugin<TItem>>();

  use(plugin: SearchPlugin<TItem>): () => void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin "${plugin.name}" is already registered, replacing.`);
    }

    this.plugins.set(plugin.name, plugin);

    return () => {
      this.remove(plugin.name);
    };
  }

  remove(name: string): void {
    const plugin = this.plugins.get(name);
    if (plugin?.onDestroy) {
      plugin.onDestroy();
    }
    this.plugins.delete(name);
  }

  get(name: string): SearchPlugin<TItem> | undefined {
    return this.plugins.get(name);
  }

  getAll(): SearchPlugin<TItem>[] {
    return [...this.plugins.values()];
  }

  runInit(context: PluginContext<TItem>): void {
    for (const plugin of this.plugins.values()) {
      plugin.onInit?.(context);
    }
  }

  runBeforeSearch(query: string, options: SearchOptions): SearchOptions {
    let result = options;
    for (const plugin of this.plugins.values()) {
      if (plugin.onBeforeSearch) {
        result = plugin.onBeforeSearch(query, result);
      }
    }
    return result;
  }

  runAfterSearch(
    results: SearchResult<TItem>[],
    query: string
  ): SearchResult<TItem>[] {
    let result = results;
    for (const plugin of this.plugins.values()) {
      if (plugin.onAfterSearch) {
        result = plugin.onAfterSearch(result, query);
      }
    }
    return result;
  }

  runSourceRegister(source: SearchSource<TItem>): void {
    for (const plugin of this.plugins.values()) {
      plugin.onSourceRegister?.(source);
    }
  }

  runSourceUnregister(sourceId: string): void {
    for (const plugin of this.plugins.values()) {
      plugin.onSourceUnregister?.(sourceId);
    }
  }

  runBeforeAction(action: BaseAction, item: TItem): boolean {
    for (const plugin of this.plugins.values()) {
      if (plugin.onBeforeAction) {
        const shouldContinue = plugin.onBeforeAction(action, item);
        if (!shouldContinue) {
          return false;
        }
      }
    }
    return true;
  }

  runAfterAction(action: BaseAction, item: TItem): void {
    for (const plugin of this.plugins.values()) {
      plugin.onAfterAction?.(action, item);
    }
  }

  runItemsChange(items: TItem[]): void {
    for (const plugin of this.plugins.values()) {
      plugin.onItemsChange?.(items);
    }
  }

  clear(): void {
    for (const plugin of this.plugins.values()) {
      plugin.onDestroy?.();
    }
    this.plugins.clear();
  }
}

export function createPlugin<TItem extends BaseSearchItem = SearchItem>(
  config: SearchPlugin<TItem>
): SearchPlugin<TItem> {
  return config;
}
