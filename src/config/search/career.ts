import { CAREER_TIMELINE } from "@/config/career";

import type { AppSearchItem } from "./types";

export const buildCareerItems = (): AppSearchItem[] =>
  CAREER_TIMELINE.map((entry) => ({
    description: `${entry.company} (${entry.year})`,
    id: `career:${entry.year.replaceAll(/\s+/g, "-").toLowerCase()}`,
    keywords: [
      entry.company,
      entry.jobType,
      ...entry.details,
      ...(entry.expanded?.techStack.primary ?? []),
    ],
    meta: {
      action: { path: "/career", type: "navigate" },
      category: "career",
      icon: entry.icon,
    },
    title: entry.title,
  }));
