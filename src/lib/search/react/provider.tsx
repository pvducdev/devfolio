import { type JSX, type ReactNode, useState } from "react";

import createCtx from "@/lib/create-ctx";

import {
  createSearchClient,
  type SearchClient,
  type SearchClientOptions,
} from "../core/client";
import type { BaseSearchItem, SearchItem } from "../core/types";

const [useSearchClient, SearchClientProvider] = createCtx<
  SearchClient<BaseSearchItem>
>("useSearchClient must be used within a SearchProvider");

export interface SearchProviderProps<
  TItem extends BaseSearchItem = SearchItem,
> {
  client?: SearchClient<TItem>;
  options?: SearchClientOptions<TItem>;
  children: ReactNode;
}

export function SearchProvider<TItem extends BaseSearchItem = SearchItem>({
  client: providedClient,
  options,
  children,
}: SearchProviderProps<TItem>): JSX.Element {
  const [client] = useState(
    () => providedClient ?? createSearchClient<TItem>(options)
  );

  return (
    <SearchClientProvider value={client as SearchClient<BaseSearchItem>}>
      {children}
    </SearchClientProvider>
  );
}

export { useSearchClient };
