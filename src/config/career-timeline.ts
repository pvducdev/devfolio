import type { LucideIcon } from "lucide-react";
import { type JobType, PERSONAL_INFO } from "./personal";

export type { JobType } from "./personal";

export type ExpandedContent = {
  description: string;
  techStack: {
    primary: string[];
    tools?: string[];
    infrastructure?: string[];
  };
  metrics?: string[];
};

export type CareerSection = {
  id: string;
  year: string;
  icon: LucideIcon;
  jobType: JobType;
  card: {
    title: string;
    subtitle: string;
    details: string[];
    expanded?: ExpandedContent;
  };
};

export const CAREER_SECTIONS: CareerSection[] = PERSONAL_INFO.career.map(
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
