import { Code, File } from "lucide-react";
import type { ComponentType } from "react";

import { activities } from "@/components/sidebar/activities";
import { CAREER_TIMELINE } from "@/config/career";
import type { PageTreeItem } from "@/config/page";
import { ABOUT_TREE, PROJECT_TREE } from "@/config/page";
import type { Skills } from "@/config/skills";
import { SKILLS } from "@/config/skills";

export type SearchCategory = "page" | "skill" | "career";

export interface SearchItem {
  id: string;
  title: string;
  description?: string;
  keywords?: string[];
  category: SearchCategory;
  icon: ComponentType;
  path: string;
}

type Skill =
  | Skills["core"][number]
  | Skills["stack"][number]
  | Skills["devops"][number];

const buildSlug = (value: string): string =>
  value.replaceAll(/\s+/gu, "-").toLowerCase();

const buildActivityItems = (): SearchItem[] =>
  activities.map((activity) => ({
    category: "page",
    icon: activity.icon,
    id: `pages:activity:${activity.key}`,
    path: `/${activity.key}`,
    title: activity.name(),
  }));

const buildTreeItems = (
  tree: Record<string, PageTreeItem>,
  prefix: string
): SearchItem[] =>
  Object.entries(tree).flatMap(([key, node]) =>
    node.path
      ? [
          {
            category: "page" as const,
            description: node.path,
            icon: File,
            id: `pages:tree:${prefix}:${key}`,
            path: node.path,
            title: node.name.replace(".tsx", ""),
          },
        ]
      : []
  );

const buildSkillItems = (
  skills: readonly Skill[],
  group: string
): SearchItem[] =>
  skills.map((skill) => ({
    category: "skill",
    description: skill.tag,
    icon: Code,
    id: `skill:${group}:${buildSlug(skill.name)}`,
    keywords: "details" in skill ? [...skill.details] : undefined,
    path: "/skills",
    title: skill.name,
  }));

const buildCareerItems = (): SearchItem[] =>
  CAREER_TIMELINE.map((entry) => ({
    category: "career",
    description: `${entry.company} (${entry.year})`,
    icon: entry.icon,
    id: `career:${buildSlug(entry.year)}`,
    keywords: [
      entry.company,
      entry.jobType,
      ...entry.details,
      ...(entry.expanded?.techStack.primary ?? []),
    ],
    path: "/career",
    title: entry.title,
  }));

export const buildSearchItems = (): SearchItem[] => [
  ...buildActivityItems(),
  ...buildTreeItems(ABOUT_TREE, "about"),
  ...buildTreeItems(PROJECT_TREE, "project"),
  ...buildSkillItems(SKILLS.core, "core"),
  ...buildSkillItems(SKILLS.stack, "stack"),
  ...buildSkillItems(SKILLS.devops, "devops"),
  ...buildCareerItems(),
];
