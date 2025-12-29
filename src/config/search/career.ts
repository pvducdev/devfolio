import { CAREER_TIMELINE } from "@/config/career";

import type { AppSearchItem } from "./types";

export function buildCareerItems(): AppSearchItem[] {
  return CAREER_TIMELINE.map((entry) => ({
    id: `career:${entry.year.replace(/\s+/g, "-").toLowerCase()}`,
    title: entry.title,
    description: `${entry.company} (${entry.year})`,
    keywords: [
      entry.company,
      entry.jobType,
      ...entry.details,
      ...(entry.expanded?.techStack.primary ?? []),
    ],
    meta: {
      category: "career",
      icon: entry.icon,
      action: { type: "navigate", path: "/career" },
    },
  }));
}
