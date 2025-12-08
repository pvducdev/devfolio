import type { LucideIcon } from "lucide-react";
import { Building2, Coffee, GraduationCap, Monitor, Users } from "lucide-react";
import {
  page_about_interest1,
  page_about_interest2,
  page_about_interest3,
  page_about_longbio,
  page_about_shortbio,
} from "@/paraglide/messages.js";

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

export const PERSONAL_INFO = {
  name: "PVD",
  nickname: "D",
  dob: 2001,
  role: "Frontend Developer",
  location: "HCMC, Vietnam",
  experience: 3, // years
  openToWork: true,

  contact: {
    email: "pvducc.dev@gmail.com",
    github: "https://github.com/pvducdev",
    linkedin: "https://linkedin.com/in/username",
    gitlab: "https://gitlab.com/pvducc.dev",
  },

  resume: {
    url: "https://snippet.embedpdf.com/ebook.pdf",
    fileName: "pvd-resume.pdf",
  },

  skills: {
    core: [
      {
        name: "React",
        tag: "Mastery",
        details: [
          "Custom Hooks",
          "Context API",
          "Concurrent Features",
          "Re-render Optimization",
        ],
      },
      {
        name: "TypeScript",
        tag: "Strict Mode",
        details: [
          "Generics",
          "Utility Types",
          "Zod Integration",
          "Declaration Merging",
        ],
      },
    ],
    stack: [
      { name: "Next.js", tag: "App Router / SSR" },
      { name: "Svelte", tag: "SvelteKit / SSR" },
      { name: "Tailwind", tag: "Design Systems" },
      { name: "Zustand", tag: "Global State" },
      { name: "TanStack Query", tag: "Server State" },
    ],
    devops: [
      { name: "GitHub Actions", tag: "CI/CD Pipelines" },
      { name: "Docker", tag: "Containerization" },
      { name: "Jest / Cypress", tag: "Unit & E2E Testing" },
      { name: "TurboRepo / Nx", tag: "Package Manager" },
      { name: "Vite / Webpack", tag: "Module Bundler" },
      { name: "Sanity / Strapi", tag: "Headless CMS" },
    ],
    standards: {
      performance: [
        "Core Web Vitals (LCP/CLS)",
        "Tree Shaking & Lazy Loading",
        "Image Optimization (WebP/AVIF)",
      ],
      accessibility: [
        "WCAG 2.1 AA Compliance",
        "Semantic HTML5",
        "Keyboard Navigation Support",
      ],
      bestPractices: [
        "DRY / SOLID Principles",
        "Component Composition",
        "Atomic Design Pattern",
      ],
    },
    workflow: [
      { name: "Agile/Scrum", highlighted: true },
      { name: "Code Reviews", highlighted: false },
      { name: "TDD", highlighted: true },
      { name: "Pair Programming", highlighted: false },
      { name: "Mentorship", highlighted: false },
      { name: "Technical Writing", highlighted: true },
      { name: "Problem Solving", highlighted: false },
    ],
    exploring: ["WebAssembly", "Rust"],
  },

  get interests() {
    return [
      page_about_interest1(),
      page_about_interest2(),
      page_about_interest3(),
    ];
  },

  about: {
    get shortBio() {
      return page_about_shortbio();
    },
    get longBio() {
      return page_about_longbio();
    },
  },

  career: [
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
  ] as CareerEntry[],
};

export type PersonalInfo = typeof PERSONAL_INFO;
