import { createFuseSearchClient } from "./adapters/fuse";
import {
  buildCommandItems,
  buildContentItems,
  buildPageItems,
} from "./sources";
import type { AppSearchItem } from "./sources/types";

export const searchClient = createFuseSearchClient<AppSearchItem>();

searchClient.add([
  ...buildPageItems(),
  ...buildCommandItems(),
  ...buildContentItems(),
]);
