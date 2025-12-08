import type { LucideIcon } from "lucide-react";
import { Building2, Coffee, GraduationCap, Monitor, Users } from "lucide-react";
import {
  career_job_education_desc,
  career_job_education_detail_1,
  career_job_education_detail_2,
  career_job_education_subtitle,
  career_job_education_title,
  career_job_freelance_desc,
  career_job_freelance_detail_1,
  career_job_freelance_detail_2,
  career_job_freelance_subtitle,
  career_job_freelance_title,
  career_job_frontend_desc,
  career_job_frontend_detail_1,
  career_job_frontend_detail_2,
  career_job_frontend_detail_3,
  career_job_frontend_subtitle,
  career_job_frontend_title,
  career_job_junior_desc,
  career_job_junior_detail_1,
  career_job_junior_detail_2,
  career_job_junior_detail_3,
  career_job_junior_subtitle,
  career_job_junior_title,
  career_job_senior_desc,
  career_job_senior_detail_1,
  career_job_senior_detail_2,
  career_job_senior_detail_3,
  career_job_senior_subtitle,
  career_job_senior_title,
  career_present,
} from "@/paraglide/messages.js";

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
    title: string;
    subtitle: string;
    details: string[];
    expanded?: ExpandedContent;
  };
};

export const getCareerSections = (): CareerSection[] => [
  {
    id: "education",
    year: "2020",
    icon: GraduationCap,
    jobType: "education",
    card: {
      title: career_job_education_title(),
      subtitle: career_job_education_subtitle(),
      details: [
        career_job_education_detail_1(),
        career_job_education_detail_2(),
      ],
      expanded: {
        description: career_job_education_desc(),
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
      title: career_job_freelance_title(),
      subtitle: career_job_freelance_subtitle(),
      details: [
        career_job_freelance_detail_1(),
        career_job_freelance_detail_2(),
      ],
      expanded: {
        description: career_job_freelance_desc(),
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
      title: career_job_junior_title(),
      subtitle: career_job_junior_subtitle(),
      details: [
        career_job_junior_detail_1(),
        career_job_junior_detail_2(),
        career_job_junior_detail_3(),
      ],
      expanded: {
        description: career_job_junior_desc(),
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
      title: career_job_frontend_title(),
      subtitle: career_job_frontend_subtitle(),
      details: [
        career_job_frontend_detail_1(),
        career_job_frontend_detail_2(),
        career_job_frontend_detail_3(),
      ],
      expanded: {
        description: career_job_frontend_desc(),
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
    year: career_present(),
    icon: Monitor,
    jobType: "fulltime",
    card: {
      title: career_job_senior_title(),
      subtitle: career_job_senior_subtitle(),
      details: [
        career_job_senior_detail_1(),
        career_job_senior_detail_2(),
        career_job_senior_detail_3(),
      ],
      expanded: {
        description: career_job_senior_desc(),
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
];

// For backward compatibility
export const CAREER_SECTIONS = getCareerSections();

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
