import { CAREER_TIMELINE } from "@/config/career";
import { PERSONAL_INFO } from "@/config/personal-info";
import type { CareerSection } from "@/types/career";

export type { CareerSection, ExpandedContent, JobType } from "@/types/career";

export const CAREER_SECTIONS: CareerSection[] = CAREER_TIMELINE.map(
  (entry, index) => ({
    id: `career-${index}`,
    year: entry.year,
    icon: entry.icon,
    jobType: entry.jobType,
    card: {
      title: entry.title,
      subtitle: entry.company,
      details: entry.details,
      expanded: entry.expanded,
    },
  })
);

export const CHARACTER_CONFIG = {
  src: "/character.riv",
  stateMachine: "machine",
  runningInput: "Number 1",
  size: { width: 128, height: 128 },
  states: { idle: 0, running: 1, milestone: 4 },
} as const;

export const UI_CONFIG = {
  sectionMargin: "0px -200px",
  sectionSpace: "space-x-400",
} as const;

export const DEFAULT_YEAR = PERSONAL_INFO.dob.toString();
