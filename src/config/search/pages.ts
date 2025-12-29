import { File } from "lucide-react";

import { ABOUT_TREE, PROJECT_TREE } from "@/config/page";
import { activities } from "@/config/routes";

import type { AppSearchItem } from "./types";

function extractTreeItems(
  tree: Record<string, { name: string; children?: string[]; path?: string }>,
  prefix: string
): AppSearchItem[] {
  const items: AppSearchItem[] = [];

  for (const [key, node] of Object.entries(tree)) {
    if (node.path) {
      items.push({
        id: `pages:tree:${prefix}:${key}`,
        title: node.name.replace(".tsx", ""),
        description: node.path,
        meta: {
          category: "page",
          icon: File,
          action: { type: "navigate", path: node.path },
        },
      });
    }
  }

  return items;
}

export function buildPageItems(): AppSearchItem[] {
  const items: AppSearchItem[] = [];

  for (const activity of activities) {
    items.push({
      id: `pages:activity:${activity.key}`,
      title: activity.name(),
      meta: {
        category: "page",
        icon: activity.icon,
        action: { type: "navigate", path: `/${activity.key}` },
      },
    });
  }

  items.push(...extractTreeItems(ABOUT_TREE, "about"));
  items.push(...extractTreeItems(PROJECT_TREE, "project"));

  return items;
}
