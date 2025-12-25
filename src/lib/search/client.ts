import { createFuseAdapter } from "./adapters/fuse";
import { createSearchClient } from "./core/client";
import {
  buildCommandItems,
  buildContentItems,
  buildPageItems,
} from "./sources";
import type { AppSearchItem } from "./sources/types";

export const searchClient = createSearchClient<AppSearchItem>({
  adapter: createFuseAdapter<AppSearchItem>({
    keys: [
      { name: "title", weight: 1.0 },
      { name: "description", weight: 0.7 },
      { name: "keywords", weight: 0.5 },
    ],
  }),
});

searchClient.add(buildPageItems());
searchClient.add(buildCommandItems());
searchClient.add(buildContentItems());
