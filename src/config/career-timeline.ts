import type { LucideIcon } from "lucide-react";
import { Building2, Coffee, GraduationCap, Monitor, Users } from "lucide-react";

export type CardStyle = "blackboard" | "postit" | "window" | "code";

export type JobType = "fulltime" | "parttime" | "freelance" | "education";

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
    style: CardStyle;
    title: string;
    subtitle: string;
    details: string[];
    expanded?: ExpandedContent;
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
      expanded: {
        description:
          "Studied computer science fundamentals, algorithms, and software engineering principles.",
        techStack: {
          primary: ["Java", "Python", "C++", "SQL"],
          tools: ["Git", "Linux", "VS Code"],
        },
        metrics: ["GPA: 3.8/4.0", "Dean's List", "Capstone Project Award"],
      },
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
      expanded: {
        description:
          "Built websites and web applications for small businesses and startups as a freelancer.",
        techStack: {
          primary: ["HTML", "CSS", "JavaScript", "WordPress"],
          tools: ["Figma", "GitHub", "Netlify"],
        },
        metrics: [
          "5+ client projects delivered",
          "100% client satisfaction",
          "Avg 2-week delivery time",
        ],
      },
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
      expanded: {
        description:
          "Joined an early-stage startup to build product features and learn professional development workflows.",
        techStack: {
          primary: ["React", "Node.js", "PostgreSQL", "Express"],
          tools: ["Jest", "ESLint", "Docker"],
          infrastructure: ["AWS S3", "Heroku"],
        },
        metrics: [
          "15+ features shipped",
          "Reduced bug count by 30%",
          "Mentored 2 interns",
        ],
      },
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
      expanded: {
        description:
          "Led frontend development for enterprise SaaS products, focusing on performance and scalability.",
        techStack: {
          primary: ["TypeScript", "React", "Redux", "GraphQL"],
          tools: ["Webpack", "Storybook", "Cypress", "Sentry"],
          infrastructure: ["AWS", "GitHub Actions", "Datadog"],
        },
        metrics: [
          "Reduced bundle size by 40%",
          "Improved LCP from 2.4s to 0.8s",
          "Led team of 4 developers",
        ],
      },
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
      expanded: {
        description:
          "Architecting modern web applications with cutting-edge technologies and mentoring the frontend team.",
        techStack: {
          primary: ["React 19", "TypeScript", "TanStack Router", "Zustand"],
          tools: ["Vite", "Vitest", "Biome", "Tailwind CSS v4"],
          infrastructure: ["Vercel", "Supabase", "GitHub Actions"],
        },
        metrics: [
          "Shipped 3 major product releases",
          "99.9% uptime SLA achieved",
          "Mentoring 5 engineers",
        ],
      },
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

export const CAREER_BACKGROUND_CONFIG = {
  src: "/career-bg-light.webp",
  fallbackColor: "bg-transparent",
} as const;
