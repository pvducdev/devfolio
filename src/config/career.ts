import { Building2, GraduationCap, Users } from "lucide-react";

import type { CareerEntry } from "@/types/career";

export type { CareerEntry, JobType } from "@/types/career";

export const CAREER_TIMELINE: CareerEntry[] = [
  {
    company: "Pearson BTEC FPT",
    details: ["Bachelor's Degree", "Class of 2019", "Software Engineering"],
    expanded: {
      description:
        "Dove deep into core CS concepts—algorithms, data structures, OOP, and databases. Shipped several team projects and picked up solid debugging instincts along the way.",
      metrics: [
        "GPA: 3.0",
        "English Certificate Level 2",
        "Hackathon Good Idea Recognition: https://shorturl.at/RwOgx",
      ],
      techStack: {
        infrastructure: ["GitHub", "Heroku"],
        primary: ["HTML/CSS", "Java", "Python", "C++", "SQL", "Javascript"],
        tools: ["Git", "VS/VS Code", "Eclipse", "IntelliJ IDEA", "Postman"],
      },
    },
    icon: GraduationCap,
    jobType: "education",
    title: "Software Engineering Degree",
    year: "2019",
  },
  {
    company: "Koina Investment Group",
    details: ["React", "Vue", "Typescript"],
    expanded: {
      description:
        "Developed internal tools and client-facing web apps for sale and investment platforms",
      metrics: [
        "Streamlined internal workflows",
        "Data-driven investment dashboards",
        "Reusable component library",
      ],
      techStack: {
        infrastructure: ["Keycloak", "GCP", "Gitlab"],
        primary: [
          "React Bootstrap",
          "Ant Design",
          "PrimeVue",
          "React Query/Table",
          "Zustand/Redux",
          "etc.",
        ],
        tools: ["Figma", "Docker", "ESLint/Prettier", "Vite", "Slack"],
      },
    },
    icon: Building2,
    jobType: "fulltime",
    title: "Fresher Frontend Developer",
    year: "2022-2024",
  },
  {
    company: "SOCIAL IMPACT VIETNAM",
    details: ["React", "React Native", "TypeScript"],
    expanded: {
      description:
        "Developed administrative websites and applications for managing import-export goods and tracking international orders",
      metrics: [
        "Import-export tracking dashboard",
        "Cross-platform app (iOS & Android)",
        "Real-time order status sync",
      ],
      techStack: {
        infrastructure: [
          "AWS",
          "Firebase Notification",
          "Apple/Google Developer Program",
        ],
        primary: [
          "Expo",
          "TanStack",
          "i18n",
          "NativeBase",
          "Ant Design Pro",
          "FlashList",
        ],
        tools: ["Expo EAS", "Docker"],
      },
    },
    icon: Users,
    jobType: "parttime",
    title: "Frontend Collaborator",
    year: "2023",
  },
  {
    company: "KOVA Paint Group",
    details: ["Vue", "React", "Nuxt"],
    expanded: {
      description:
        "Built and maintained Back Office systems, dealer portals, and mobile webviews",
      metrics: [
        "50+ reusable modules with dynamic config",
        "Scalable loyalty program for 10,000+ users",
        "Micro-frontend architecture design",
        "Synced with multi-service backend ecosystem",
      ],
      techStack: {
        infrastructure: ["AWS", "GitHub Actions", "Metabase"],
        primary: [
          "Refine",
          "MUI",
          "Pinia",
          "Ant Design Pro",
          "i18n",
          "TanStack",
          "etc.",
        ],
        tools: ["Cypress", "Strapi", "Algolia Search", "New Relic", "Docker"],
      },
    },
    icon: Building2,
    jobType: "fulltime",
    title: "Frontend Executive",
    year: "2024-Present",
  },
  {
    company: "Hoa Cuong Farm",
    details: ["React", "Next.js", "TypeScript"],
    expanded: {
      description:
        "Architecting modern marketplace web applications with cutting-edge technologies and AI integration.",
      metrics: [
        "AI-powered product recommendations",
        "SEO-optimized marketplace with SSR",
        "Real-time inventory sync",
      ],
      techStack: {
        infrastructure: ["AWS", "Keycloak", "GitHub Actions"],
        primary: ["Shadcn/ui", "i18n", "TanStack"],
        tools: ["Google Analytics", "Strapi", "OpenAI API"],
      },
    },
    icon: Users,
    jobType: "parttime",
    title: "Frontend Collaborator",
    year: "2025",
  },
];
