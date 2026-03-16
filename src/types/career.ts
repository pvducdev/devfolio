import type { LucideIcon } from "lucide-react";

export type JobType = "fulltime" | "parttime" | "freelance" | "education";

export interface ExpandedContent {
  description: string;
  techStack: {
    primary: string[];
    tools?: string[];
    infrastructure?: string[];
  };
  metrics?: string[];
}

export interface CareerEntry {
  year: string;
  jobType: JobType;
  icon: LucideIcon;
  title: string;
  company: string;
  details: string[];
  expanded?: ExpandedContent;
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
