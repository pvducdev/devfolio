import { Code } from "lucide-react";

import { CAREER_TIMELINE } from "@/config/career";
import { SKILLS } from "@/config/skills";

import { createSource, type SearchSource } from "../core/source";
import type { DefaultSearchItem } from "../core/types";

function buildSkillItems(): DefaultSearchItem[] {
  const items: DefaultSearchItem[] = [];

  for (const skill of SKILLS.core) {
    items.push({
      id: `content:skill:core:${skill.name.toLowerCase()}`,
      title: skill.name,
      description: skill.tag,
      keywords: skill.details,
      category: "content",
      meta: { subtype: "skill" },
      icon: Code,
      action: { type: "navigate", path: "/skills" },
    });
  }

  for (const skill of SKILLS.stack) {
    items.push({
      id: `content:skill:stack:${skill.name.toLowerCase().replace(/\s+/g, "-")}`,
      title: skill.name,
      description: skill.tag,
      category: "content",
      meta: { subtype: "skill" },
      icon: Code,
      action: { type: "navigate", path: "/skills" },
    });
  }

  for (const tool of SKILLS.devops) {
    items.push({
      id: `content:skill:devops:${tool.name.toLowerCase().replace(/\s+/g, "-")}`,
      title: tool.name,
      description: tool.tag,
      category: "content",
      meta: { subtype: "skill" },
      icon: Code,
      action: { type: "navigate", path: "/skills" },
    });
  }

  return items;
}

function buildCareerItems(): DefaultSearchItem[] {
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
    category: "content" as const,
    meta: { subtype: "career" as const },
    icon: entry.icon,
    action: { type: "navigate" as const, path: "/career" },
  }));
}

function buildContentItems(): DefaultSearchItem[] {
  return [...buildSkillItems(), ...buildCareerItems()];
}

export function createContentSource(): SearchSource<DefaultSearchItem> {
  return createSource({
    id: "content",
    name: "Content",
    category: "content",
    priority: 80,
    fetch: buildContentItems,
  });
}

export { buildContentItems };
