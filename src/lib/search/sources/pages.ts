import { File } from "lucide-react";

import { ABOUT_TREE, PROJECT_TREE } from "@/config/page";
import { activities } from "@/config/routes";

import { createSource, type SearchSource } from "../core/source";
import type { DefaultSearchItem } from "../core/types";

function extractTreeItems(
  tree: Record<string, { name: string; children?: string[]; path?: string }>,
  prefix: string
): DefaultSearchItem[] {
  const items: DefaultSearchItem[] = [];

  for (const [key, node] of Object.entries(tree)) {
    if (node.path) {
      items.push({
        id: `pages:tree:${prefix}:${key}`,
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

function buildPageItems(): DefaultSearchItem[] {
  const items: DefaultSearchItem[] = [];

  for (const activity of activities) {
    items.push({
      id: `pages:activity:${activity.key}`,
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

export function createPagesSource(): SearchSource<DefaultSearchItem> {
  return createSource({
    id: "pages",
    name: "Pages",
    category: "page",
    priority: 100,
    fetch: buildPageItems,
  });
}

export { buildPageItems };
