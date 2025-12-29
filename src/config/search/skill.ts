import { Code } from "lucide-react";

import type { Skills } from "@/config/skills";
import { SKILLS } from "@/config/skills";

import type { AppSearchItem } from "./types";

type Skill =
  | Skills["core"][number]
  | Skills["stack"][number]
  | Skills["devops"][number];

function buildSkillGroup(
  skills: readonly Skill[],
  group: string
): AppSearchItem[] {
  return skills.map((skill) => ({
    id: `skill:${group}:${skill.name.toLowerCase().replace(/\s+/g, "-")}`,
    title: skill.name,
    description: skill.tag,
    keywords: "details" in skill ? skill.details : undefined,
    meta: {
      category: "skill",
      icon: Code,
      action: { type: "navigate", path: "/skills" },
    },
  }));
}

export function buildSkillItems(): AppSearchItem[] {
  return [
    ...buildSkillGroup(SKILLS.core, "core"),
    ...buildSkillGroup(SKILLS.stack, "stack"),
    ...buildSkillGroup(SKILLS.devops, "devops"),
  ];
}
