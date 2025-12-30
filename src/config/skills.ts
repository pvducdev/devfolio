export const SKILLS = {
  core: [
    {
      name: "React",
      alternates: ["Vue"],
      tag: "Mastery",
      details: [
        "Component Composition",
        "State Management",
        "Reactivity Patterns",
        "Performance Optimization",
      ],
    },
    {
      name: "TypeScript",
      tag: "Strict Mode",
      details: [
        "Generics",
        "Utility Types",
        "Schema validation Integration",
        "Declaration Merging",
      ],
    },
  ],
  stack: [
    { name: "Next.js", tag: "App Router / SSR" },
    { name: "Svelte", tag: "SvelteKit / SSR" },
    { name: "NestJS", tag: "Modular / DI" },
    { name: "Zustand / Redux", tag: "Global State" },
  ],
  devops: [
    { name: "GitHub Actions", tag: "CI/CD Pipelines" },
    { name: "Docker", tag: "Containerization" },
    { name: "Cypress", tag: "Unit & E2E Testing" },
    { name: "Vite / Webpack", tag: "Module Bundler" },
    { name: "Strapi", tag: "Headless CMS" },
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
    { name: "Pair Programming", highlighted: false },
    { name: "Technical Writing", highlighted: true },
    { name: "Problem Solving", highlighted: false },
  ],
  exploring: ["WebAssembly", "Rust"],
};

export type Skills = typeof SKILLS;
