import {
  page_about_interest1,
  page_about_interest2,
  page_about_interest3,
  page_about_longbio,
  page_about_shortbio,
} from "@/paraglide/messages.js";

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
};

export type PersonalInfo = typeof PERSONAL_INFO;
