export const SKILLS = {
  core: [
    {
      alternates: ["Vue"],
      details: [
        "Component Composition",
        "State Management",
        "Reactivity Patterns",
        "Performance Optimization",
      ],
      name: "React",
      tag: "Mastery",
    },
    {
      details: [
        "Generics",
        "Utility Types",
        "Schema validation Integration",
        "Declaration Merging",
      ],
      name: "TypeScript",
      tag: "Strict Mode",
    },
  ],
  devops: [
    { name: "GitHub Actions", tag: "CI/CD Pipelines" },
    { name: "Docker", tag: "Containerization" },
    { name: "Cypress", tag: "Unit & E2E Testing" },
    { name: "Vite / Webpack", tag: "Module Bundler" },
    { name: "Strapi", tag: "Headless CMS" },
  ],
  exploring: ["Golang"],
  stack: [
    { name: "Next.js", tag: "App Router / SSR" },
    { name: "Nuxt.js", tag: "App Router / SSR" },
    { name: "Svelte", tag: "SvelteKit / SSR" },
    { name: "NestJS", tag: "Modular / DI" },
  ],
  standards: {
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
    performance: [
      "Core Web Vitals (LCP/CLS)",
      "Tree Shaking & Lazy Loading",
      "Image Optimization (WebP/AVIF)",
    ],
  },
  workflow: [
    { highlighted: true, name: "Agile/Scrum" },
    { highlighted: false, name: "Code Reviews" },
    { highlighted: true, name: "Technical Writing" },
    { highlighted: false, name: "Pair Programming" },
    { highlighted: true, name: "Problem Solving" },
  ],
} as const;

export type Skills = typeof SKILLS;
