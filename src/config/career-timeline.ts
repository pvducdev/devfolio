import type { LucideIcon } from "lucide-react";
import { Building2, Coffee, GraduationCap, Monitor, Users } from "lucide-react";

export type CardStyle = "blackboard" | "postit" | "window" | "code";

export type JobType = "fulltime" | "parttime" | "freelance" | "education";

export type CareerSection = {
  id: string;
  year: string;
  icon: LucideIcon;
  jobType: JobType;
  card: {
    style: CardStyle;
    title: string;
    subtitle: string;
    details: string[];
  };
};

export const CAREER_SECTIONS: CareerSection[] = [
  {
    id: "education",
    year: "2020",
    icon: GraduationCap,
    jobType: "education",
    card: {
      style: "blackboard",
      title: "Computer Science",
      subtitle: "University Name",
      details: ["Bachelor's Degree", "Class of 2020"],
    },
  },
  {
    id: "first-steps",
    year: "2021",
    icon: Coffee,
    jobType: "freelance",
    card: {
      style: "postit",
      title: "Freelance Developer",
      subtitle: "Remote",
      details: ["HTML/CSS/JS", "First client projects"],
    },
  },
  {
    id: "gaining-xp",
    year: "2021-2022",
    icon: Users,
    jobType: "parttime",
    card: {
      style: "window",
      title: "Junior Developer",
      subtitle: "Startup Co.",
      details: ["React", "Node.js", "Team collaboration"],
    },
  },
  {
    id: "professional",
    year: "2022-2023",
    icon: Building2,
    jobType: "fulltime",
    card: {
      style: "window",
      title: "Frontend Developer",
      subtitle: "Tech Corp",
      details: ["TypeScript", "React", "CI/CD"],
    },
  },
  {
    id: "current",
    year: "Present",
    icon: Monitor,
    jobType: "fulltime",
    card: {
      style: "code",
      title: "Senior Frontend Developer",
      subtitle: "Current Company",
      details: ["React", "TypeScript", "TanStack"],
    },
  },
] as const;

export const CHARACTER_CONFIG = {
  src: "/character.riv",
  stateMachine: "machine",
  runningInput: "Number 1",
  size: { width: 128, height: 128 },
} as const;

export const RUNNER_CONFIG = {
  // Values used in JS calculations (infinite scroll, milestone detection)
  sectionWidth: 1000, // w-[1000px] in Section component
  spacerWidth: 144, // w-36 (144px) in CareerRunner spacer divs
  paddingEnd: 208, // w-52 (208px) in CareerRunner padding div
  // Note: Character is centered dynamically (left-1/2 -translate-x-1/2)
} as const;

export const MILESTONE_ANIMATION_CONFIG = {
  // Easing curve: starts fast, slows down gently (soft landing)
  easing: [0.25, 1, 0.5, 1] as const,

  // Durations (in seconds)
  spotlightDim: 0.4,
  cardPop: 0.5,
  groundPulse: 0.3,
  yearFlip: 0.3,

  // Opacity and scale values
  dimmedOpacity: 0.6,
  cardScaleActive: 1.05,
  cardScaleInactive: 0.9,
  cardOpacityActive: 1,
  cardOpacityInactive: 0.6,

  // Glow colors by job type (using Tailwind v4 oklch colors)
  glowColors: {
    fulltime: "oklch(from var(--color-green-500) l c h / 0.6)",
    parttime: "oklch(from var(--color-blue-500) l c h / 0.6)",
    freelance: "oklch(from var(--color-purple-500) l c h / 0.6)",
    education: "oklch(from var(--color-amber-400) l c h / 0.6)",
  },
} as const;

export const INFINITE_SCROLL_CONFIG = {
  // Number of sections to clone at each end for seamless looping
  leadingCloneSections: 3, // Clone last 3 sections at the start
  trailingCloneSections: 2, // Clone first 2 sections at the end
  includeLoopConnectorInClone: true,

  // Teleport triggers when scroll enters clone zone past this threshold
  teleportThreshold: 200,

  // Debounce to prevent rapid oscillation during fast scrolling
  teleportDebounceMs: 50,
} as const;
