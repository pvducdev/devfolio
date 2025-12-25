import { createFuseAdapter } from "./adapters/fuse";
import { createSearchClient } from "./core/client";
import {
  buildCommandItems,
  buildContentItems,
  buildPageItems,
} from "./sources";
import type { AppSearchItem } from "./sources/types";

export const searchClient = createSearchClient<AppSearchItem>({
  adapter: createFuseAdapter<AppSearchItem>(),
});

// Automatic batching: multiple adds = single index rebuild
searchClient.add(buildPageItems());
searchClient.add(buildCommandItems());
searchClient.add(buildContentItems());
