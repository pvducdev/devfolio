import type { ComponentType } from "react";

export interface BaseSearchItem {
  id: string;
  title: string;
  description?: string;
  keywords?: string[];
}

export interface BaseAction<TType extends string = string> {
  type: TType;
}

export interface NavigateAction extends BaseAction<"navigate"> {
  path: string;
}

export interface CommandAction extends BaseAction<"command"> {
  commandName: string;
  payload?: unknown;
}

export type DefaultAction = NavigateAction | CommandAction;

export interface SearchItem<
  TCategory extends string = string,
  TAction extends BaseAction = DefaultAction,
  TMeta extends Record<string, unknown> = Record<string, unknown>,
> extends BaseSearchItem {
  category: TCategory;
  action: TAction;
  meta?: TMeta;
  priority?: number;
  isDynamic?: boolean;
  icon?: ComponentType;
  shortcut?: string;
}

export interface SearchResult<TItem extends BaseSearchItem = SearchItem> {
  item: TItem;
  score: number;
  matches?: SearchMatch[];
}

export interface SearchMatch {
  key: string;
  value: string;
  indices: [number, number][];
}

export type GroupedResults<TItem extends BaseSearchItem = SearchItem> = Record<
  string,
  SearchResult<TItem>[]
>;

export interface SearchOptions {
  limit?: number;
  threshold?: number;
  categories?: string[];
  includeMatches?: boolean;
}

export type DefaultSearchItem = SearchItem<
  "page" | "command" | "content",
  DefaultAction,
  { subtype?: "skill" | "project" | "career" }
>;
