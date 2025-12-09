import type { LucideIcon } from "lucide-react";
import { Building2, Coffee, GraduationCap, Monitor, Users } from "lucide-react";

export type JobType = "fulltime" | "parttime" | "freelance" | "education";

export type CareerEntry = {
  year: string;
  jobType: JobType;
  icon: LucideIcon;
  title: string;
  company: string;
  details: string[];
  expanded?: {
    description: string;
    techStack: {
      primary: string[];
      tools?: string[];
      infrastructure?: string[];
    };
    metrics?: string[];
  };
};

export const CAREER_TIMELINE: CareerEntry[] = [
  {
    year: "2020",
    jobType: "education",
    icon: GraduationCap,
    title: "Computer Science",
    company: "University Name",
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
  {
    year: "2021",
    jobType: "freelance",
    icon: Coffee,
    title: "Freelance Developer",
    company: "Remote",
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
  {
    year: "2021-2022",
    jobType: "parttime",
    icon: Users,
    title: "Junior Developer",
    company: "Startup Co.",
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
  {
    year: "2022-2023",
    jobType: "fulltime",
    icon: Building2,
    title: "Frontend Developer",
    company: "Tech Corp",
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
  {
    year: "Present",
    jobType: "fulltime",
    icon: Monitor,
    title: "Senior Frontend Developer",
    company: "Current Company",
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
];
