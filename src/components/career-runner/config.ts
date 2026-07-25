import { CAREER_TIMELINE } from "@/config/career";
import { PERSONAL_INFO } from "@/config/personal-info";
import type { CareerSection } from "@/types/career";

export type { CareerSection, ExpandedContent, JobType } from "@/types/career";

export const CAREER_SECTIONS: CareerSection[] = CAREER_TIMELINE.map(
  (entry, index) => ({
    card: {
      details: entry.details,
      expanded: entry.expanded,
      subtitle: entry.company,
      title: entry.title,
    },
    icon: entry.icon,
    id: `career-${index}`,
    jobType: entry.jobType,
    year: entry.year,
  })
);

export const CHARACTER_CONFIG = {
  runningInput: "Number 1",
  size: { height: 128, width: 128 },
  src: "/character.riv",
  stateMachine: "machine",
  states: { idle: 0, milestone: 4, running: 1 },
} as const;

export const UI_CONFIG = {
  sectionMargin: "0px -200px",
  sectionSpace: "space-x-400",
} as const;

export const DEFAULT_YEAR = PERSONAL_INFO.dob.toString();
