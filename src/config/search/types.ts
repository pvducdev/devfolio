import type { ComponentType } from "react";

import type { SearchItem } from "@/lib/search/core";

export interface NavigateAction {
  type: "navigate";
  path: string;
}

export type AppAction = NavigateAction;

export type AppSearchMeta = {
  icon?: ComponentType;
  shortcut?: string;
  category?: "page" | "content";
  subtype?: "skill" | "project" | "career";
  action?: AppAction;
} & Record<string, unknown>;

export type AppSearchItem = SearchItem<AppSearchMeta>;
