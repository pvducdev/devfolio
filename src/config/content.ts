export const WORK_EXPERIENCES = [
  {
    id: 1,
    date: "Mar 15, 2024",
    title: "Project Kickoff",
    description:
      "Initial team meeting and project scope definition. Established key milestones and resource allocation.",
  },
  {
    id: 2,
    date: "Mar 22, 2024",
    title: "Design Phase",
    description:
      "Completed wireframes and user interface mockups. Stakeholder review and feedback incorporated.",
  },
  {
    id: 3,
    date: "Apr 5, 2024",
    title: "Development Sprint",
    description:
      "Backend API implementation and frontend component development in progress.",
  },
  {
    id: 4,
    date: "Apr 19, 2024",
    title: "Testing & Deployment",
    description:
      "Quality assurance testing, performance optimization, and production deployment preparation.",
  },
] as const;

export type WorkExperience = (typeof WORK_EXPERIENCES)[number];

type ProjectTreeItem = {
  name: string;
  children?: string[];
};

export const PROJECT_TREE: Record<string, ProjectTreeItem> = {
  engineering: {
    name: "Engineering",
    children: ["frontend", "backend"],
  },
  frontend: {
    name: "Frontend",
    children: ["design-system", "web-platform"],
  },
  "design-system": {
    name: "Design System",
    children: ["components", "tokens", "guidelines"],
  },
  components: { name: "Components" },
  tokens: { name: "Tokens" },
  guidelines: { name: "Guidelines" },
  "web-platform": { name: "Web Platform" },
  backend: {
    name: "Backend",
    children: ["apis", "infrastructure"],
  },
  apis: { name: "APIs" },
  infrastructure: { name: "Infrastructure" },
} as const;

export type ProjectTree = typeof PROJECT_TREE;

export const PROJECT_TREE_CONFIG = {
  rootItemId: "engineering",
  defaultExpanded: ["engineering", "frontend", "design-system"],
  indent: 20,
} as const;

type AboutTreeItem = {
  name: string;
  children?: string[];
};

export const ABOUT_TREE: Record<string, AboutTreeItem> = {
  about: {
    name: "About",
    children: ["about.mdx"],
  },
  "about.mdx": { name: "about.mdx" },
} as const;

export type AboutTree = typeof ABOUT_TREE;

export const ABOUT_TREE_CONFIG = {
  rootItemId: "about",
  defaultExpanded: ["about"],
  indent: 20,
} as const;
