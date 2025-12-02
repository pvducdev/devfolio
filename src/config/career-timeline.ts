export type CardStyle = "blackboard" | "postit" | "window" | "code";

export type LandmarkType =
  | "university"
  | "cafe"
  | "coworking"
  | "office"
  | "tech-station";

export type CareerSection = {
  id: string;
  year: string;
  landmark: LandmarkType;
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
    card: {
      style: "code",
      title: "Senior Frontend Developer",
      subtitle: "Current Company",
      details: ["React", "TypeScript", "TanStack"],
    },
  },
] as const;

export const CHARACTER_CONFIG = {
  src: "/public/character.riv",
  stateMachine: "State Machine",
  runningInput: "isRunning",
  size: { width: 64, height: 64 },
} as const;

export const RUNNER_CONFIG = {
  sectionWidth: 1000, // px per section
  groundBottom: 12, // ground line position from bottom
  characterPosition: { left: 60, bottom: 12 }, // character sits on ground
  cardTop: 60, // card position from top
  landmarkBottom: 12, // landmark sits on ground
} as const;
