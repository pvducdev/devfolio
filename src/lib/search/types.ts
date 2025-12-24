import type { ComponentType } from "react";

export type SearchCategory = "page" | "command" | "content";

export type ContentSubtype = "skill" | "project" | "career";

export type SearchAction =
  | { type: "navigate"; path: string }
  | { type: "command"; commandName: string };

export interface SearchItem {
  id: string;
  title: string;
  description?: string;
  keywords?: string[];
  category: SearchCategory;
  subtype?: ContentSubtype;
  icon?: ComponentType;
  shortcut?: string;
  action: SearchAction;
  isDynamic?: boolean;
}

export interface SearchResult {
  item: SearchItem;
  score: number;
}

export interface GroupedResults {
  pages: SearchResult[];
  commands: SearchResult[];
  content: SearchResult[];
}
