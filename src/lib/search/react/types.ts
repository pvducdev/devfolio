import type { ComponentType } from "react";

import type { SearchItem } from "../core/types";

export interface NavigateAction {
  type: "navigate";
  path: string;
}

export interface CommandAction {
  type: "command";
  commandName: string;
  payload?: unknown;
}

export type AppAction = NavigateAction | CommandAction;

export type AppSearchMeta = {
  icon?: ComponentType;
  shortcut?: string;
  category?: "page" | "command" | "content";
  subtype?: "skill" | "project" | "career";
  action?: AppAction;
} & Record<string, unknown>;

export type AppSearchItem = SearchItem<AppSearchMeta>;
