import type { LucideIcon } from "lucide-react";
import { Building2, GraduationCap, Users } from "lucide-react";

export type JobType = "fulltime" | "parttime" | "freelance" | "education";

export interface CareerEntry {
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
}

export const CAREER_TIMELINE: CareerEntry[] = [
  {
    year: "2019",
    jobType: "education",
    icon: GraduationCap,
    title: "Software Engineering Degree",
    company: "Pearson BTEC FPT",
    details: ["Bachelor's Degree", "Class of 2019", "Software Engineering"],
    expanded: {
      description:
        "Dove deep into core CS concepts—algorithms, data structures, OOP, and databases. Shipped several team projects and picked up solid debugging instincts along the way.",
      techStack: {
        primary: ["HTML/CSS", "Java", "Python", "C++", "SQL", "Javascript"],
        tools: ["Git", "VS/VS Code", "Eclipse", "IntelliJ IDEA", "Postman"],
        infrastructure: ["GitHub", "Heroku"],
      },
      metrics: [
        "GPA: 3.0",
        "English Certificate Level 2",
        "Hackathon Good Idea Recognition: https://shorturl.at/RwOgx",
      ],
    },
  },
  {
    year: "2022-2024",
    jobType: "fulltime",
    icon: Building2,
    title: "Fresher Frontend Developer",
    company: "Koina Investment Group",
    details: ["React", "Vue", "Typescript"],
    expanded: {
      description:
        "Developed internal tools and client-facing web apps for sale and investment platforms",
      techStack: {
        primary: [
          "React Bootstrap",
          "Ant Design",
          "PrimeVue",
          "React Query/Table",
          "Zustand/Redux",
          "etc.",
        ],
        tools: ["Figma", "Docker", "ESLint/Prettier", "Vite", "Slack"],
        infrastructure: ["Keycloak", "GCP", "Gitlab"],
      },
      metrics: [
        "Streamlined internal workflows",
        "Data-driven investment dashboards",
        "Reusable component library",
      ],
    },
  },
  {
    year: "2023",
    jobType: "parttime",
    icon: Users,
    title: "Frontend Collaborator",
    company: "SOCIAL IMPACT VIETNAM",
    details: ["React", "React Native", "TypeScript"],
    expanded: {
      description:
        "Developed administrative websites and applications for managing import-export goods and tracking international orders",
      techStack: {
        primary: [
          "Expo",
          "TanStack",
          "i18n",
          "NativeBase",
          "Ant Design Pro",
          "FlashList",
        ],
        tools: ["Expo EAS", "Docker"],
        infrastructure: [
          "AWS",
          "Firebase Notification",
          "Apple/Google Developer Program",
        ],
      },
      metrics: [
        "Import-export tracking dashboard",
        "Cross-platform app (iOS & Android)",
        "Real-time order status sync",
      ],
    },
  },
  {
    year: "2024-Present",
    jobType: "fulltime",
    icon: Building2,
    title: "Frontend Executive",
    company: "KOVA Paint Group",
    details: ["Vue", "React", "Nuxt"],
    expanded: {
      description:
        "Built and maintained Back Office systems, dealer portals, and mobile webviews",
      techStack: {
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
        infrastructure: ["AWS", "GitHub Actions", "Metabase"],
      },
      metrics: [
        "50+ reusable modules with dynamic config",
        "Scalable loyalty program for 10,000+ users",
        "Micro-frontend architecture design",
        "Synced with multi-service backend ecosystem",
      ],
    },
  },
  {
    year: "2025",
    jobType: "parttime",
    icon: Users,
    title: "Frontend Collaborator",
    company: "Hoa Cuong Farm",
    details: ["React", "Next.js", "TypeScript"],
    expanded: {
      description:
        "Architecting modern marketplace web applications with cutting-edge technologies and AI integration.",
      techStack: {
        primary: ["Shadcn/ui", "i18n", "TanStack"],
        tools: ["Google Analytics", "Strapi", "OpenAI API"],
        infrastructure: ["AWS", "Keycloak", "GitHub Actions"],
      },
      metrics: [
        "AI-powered product recommendations",
        "SEO-optimized marketplace with SSR",
        "Real-time inventory sync",
      ],
    },
  },
];
