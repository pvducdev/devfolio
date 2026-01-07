import type { LucideIcon } from "lucide-react";
import { CAREER_TIMELINE, type JobType } from "@/config/career";
import { PERSONAL_INFO } from "@/config/personal-info.ts";

export type { JobType } from "@/config/career";

export interface ExpandedContent {
  description: string;
  techStack: {
    primary: string[];
    tools?: string[];
    infrastructure?: string[];
  };
  metrics?: string[];
}

export interface CareerSection {
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
}

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
