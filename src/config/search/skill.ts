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
    description: skill.tag,
    id: `skill:${group}:${skill.name.toLowerCase().replaceAll(/\s+/g, "-")}`,
    keywords: "details" in skill ? skill.details : undefined,
    meta: {
      action: { path: "/skills", type: "navigate" },
      category: "skill",
      icon: Code,
    },
    title: skill.name,
  }));
}

export function buildSkillItems(): AppSearchItem[] {
  return [
    ...buildSkillGroup(SKILLS.core, "core"),
    ...buildSkillGroup(SKILLS.stack, "stack"),
    ...buildSkillGroup(SKILLS.devops, "devops"),
  ];
}
