import { File } from "lucide-react";

import { ABOUT_TREE, PROJECT_TREE } from "@/config/page";
import { activities } from "@/config/routes";

import type { AppSearchItem } from "./types";

const extractTreeItems = (
  tree: Record<string, { name: string; children?: string[]; path?: string }>,
  prefix: string
): AppSearchItem[] => {
  const items: AppSearchItem[] = [];

  for (const [key, node] of Object.entries(tree)) {
    if (node.path) {
      items.push({
        description: node.path,
        id: `pages:tree:${prefix}:${key}`,
        meta: {
          action: { path: node.path, type: "navigate" },
          category: "page",
          icon: File,
        },
        title: node.name.replace(".tsx", ""),
      });
    }
  }

  return items;
};

export const buildPageItems = (): AppSearchItem[] => {
  const items: AppSearchItem[] = [];

  for (const activity of activities) {
    items.push({
      id: `pages:activity:${activity.key}`,
      meta: {
        action: { path: `/${activity.key}`, type: "navigate" },
        category: "page",
        icon: activity.icon,
      },
      title: activity.name(),
    });
  }

  items.push(...extractTreeItems(ABOUT_TREE, "about"));
  items.push(...extractTreeItems(PROJECT_TREE, "project"));

  return items;
};
