import { Code } from "lucide-react";

import { CAREER_TIMELINE } from "@/config/career";
import { SKILLS } from "@/config/skills";

import type { AppSearchItem } from "./types";

function buildSkillItems(): AppSearchItem[] {
  const items: AppSearchItem[] = [];

  for (const skill of SKILLS.core) {
    items.push({
      id: `content:skill:core:${skill.name.toLowerCase()}`,
      title: skill.name,
      description: skill.tag,
      keywords: skill.details,
      meta: {
        category: "content" as const,
        subtype: "skill" as const,
        icon: Code,
        action: { type: "navigate" as const, path: "/skills" },
      },
    });
  }

  for (const skill of SKILLS.stack) {
    items.push({
      id: `content:skill:stack:${skill.name.toLowerCase().replace(/\s+/g, "-")}`,
      title: skill.name,
      description: skill.tag,
      meta: {
        category: "content" as const,
        subtype: "skill" as const,
        icon: Code,
        action: { type: "navigate" as const, path: "/skills" },
      },
    });
  }

  for (const tool of SKILLS.devops) {
    items.push({
      id: `content:skill:devops:${tool.name.toLowerCase().replace(/\s+/g, "-")}`,
      title: tool.name,
      description: tool.tag,
      meta: {
        category: "content" as const,
        subtype: "skill" as const,
        icon: Code,
        action: { type: "navigate" as const, path: "/skills" },
      },
    });
  }

  return items;
}

function buildCareerItems(): AppSearchItem[] {
  return CAREER_TIMELINE.map((entry) => ({
    id: `content:career:${entry.year.replace(/\s+/g, "-").toLowerCase()}`,
    title: entry.title,
    description: `${entry.company} (${entry.year})`,
    keywords: [
      entry.company,
      entry.jobType,
      ...entry.details,
      ...(entry.expanded?.techStack.primary ?? []),
    ],
    meta: {
      category: "content" as const,
      subtype: "career" as const,
      icon: entry.icon,
      action: { type: "navigate" as const, path: "/career" },
    },
  }));
}

export function buildContentItems(): AppSearchItem[] {
  return [...buildSkillItems(), ...buildCareerItems()];
}
