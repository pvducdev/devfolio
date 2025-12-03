export type CardStyle = "blackboard" | "postit" | "window" | "code";

export type LandmarkType =
  | "university"
  | "cafe"
  | "coworking"
  | "office"
  | "tech-station";

export type JobType = "fulltime" | "parttime" | "freelance" | "education";

export type CareerSection = {
  id: string;
  year: string;
  landmark: LandmarkType;
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
    landmark: "university",
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
    landmark: "cafe",
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
    landmark: "coworking",
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
    landmark: "office",
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
    landmark: "tech-station",
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
  celebrationValue: 4,
  size: { width: 64, height: 64 },
} as const;

export const RUNNER_CONFIG = {
  sectionWidth: 1000, // px per section
  groundBottom: 12, // ground line position from bottom
  characterPosition: { left: 60, bottom: 12 }, // character sits on ground
  cardTop: 60, // card position from top
  landmarkBottom: 12, // landmark sits on ground
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
  dimmedOpacity: 0.3,
  cardScaleActive: 1.05,
  cardScaleInactive: 0.9,
  cardOpacityActive: 1,
  cardOpacityInactive: 0.6,

  // Glow colors by job type
  glowColors: {
    fulltime: "rgba(34, 197, 94, 0.6)", // green-500
    parttime: "rgba(59, 130, 246, 0.6)", // blue-500
    freelance: "rgba(168, 85, 247, 0.6)", // purple-500
    education: "rgba(251, 191, 36, 0.6)", // amber-400
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
