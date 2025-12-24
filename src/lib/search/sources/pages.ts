import { File } from "lucide-react";

import { ABOUT_TREE, PROJECT_TREE } from "@/config/page";
import { activities } from "@/config/routes";

import type { SearchItem } from "../types";

function extractTreeItems(
  tree: Record<string, { name: string; children?: string[]; path?: string }>,
  prefix: string
): SearchItem[] {
  const items: SearchItem[] = [];

  for (const [key, node] of Object.entries(tree)) {
    if (node.path) {
      items.push({
        id: `page:tree:${prefix}:${key}`,
        title: node.name.replace(".tsx", ""),
        description: node.path,
        category: "page",
        icon: File,
        action: { type: "navigate", path: node.path },
      });
    }
  }

  return items;
}

export function buildPageItems(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const activity of activities) {
    items.push({
      id: `page:activity:${activity.key}`,
      title: activity.name(),
      category: "page",
      icon: activity.icon,
      action: { type: "navigate", path: `/${activity.key}` },
    });
  }

  items.push(...extractTreeItems(ABOUT_TREE, "about"));
  items.push(...extractTreeItems(PROJECT_TREE, "project"));

  return items;
}
