import { type JSX, type ReactNode, useState } from "react";

import createCtx from "@/lib/create-ctx";

import {
  createFuseSearchClient,
  type FuseSearchClientOptions,
} from "../adapters/fuse";
import type { SearchClient } from "../core/client";
import type { BaseSearchItem, SearchItem } from "../core/types";

const [useSearchClient, SearchClientProvider] = createCtx<
  SearchClient<BaseSearchItem>
>("useSearchClient must be used within a SearchProvider");

export interface SearchProviderProps<
  TItem extends BaseSearchItem = SearchItem,
> {
  client?: SearchClient<TItem>;
  options?: FuseSearchClientOptions<TItem>;
  items?: TItem[];
  children: ReactNode;
}

export function SearchProvider<TItem extends BaseSearchItem = SearchItem>({
  client: providedClient,
  options,
  items,
  children,
}: SearchProviderProps<TItem>): JSX.Element {
  const [client] = useState(() => {
    const c = providedClient ?? createFuseSearchClient<TItem>(options);
    if (items?.length) {
      c.add(items);
    }
    return c;
  });

  return (
    <SearchClientProvider value={client as SearchClient<BaseSearchItem>}>
      {children}
    </SearchClientProvider>
  );
}

export { useSearchClient };
