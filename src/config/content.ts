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

export type ProjectTreeItem = {
  name: string;
  children?: string[];
  filePath?: string;
};

export const PROJECT_TREE: Record<string, ProjectTreeItem> = {
  engineering: {
    name: "Engineering",
    children: ["frontend", "backend"],
  },
  frontend: {
    name: "Frontend",
    children: [
      "project-1-frontend",
      "project-2-frontend",
      "project-3-frontend",
    ],
  },
  "project-1-frontend": {
    name: "projects.mdx",
    filePath: "content/projects.mdx",
  },
  "project-2-frontend": {
    name: "projects.mdx",
    filePath: "content/projects.mdx",
  },
  "project-3-frontend": {
    name: "projects.mdx",
    filePath: "content/projects.mdx",
  },
  backend: {
    name: "Backend",
    children: ["project-1-backend", "project-2-backend"],
  },
  "project-1-backend": {
    name: "projects.mdx",
    filePath: "content/projects.mdx",
  },
  "project-2-backend": {
    name: "projects.mdx",
    filePath: "content/projects.mdx",
  },
} as const;

export type ProjectTree = typeof PROJECT_TREE;

export const PROJECT_TREE_CONFIG = {
  rootItemId: "engineering",
  defaultExpanded: ["engineering", "frontend"],
  indent: 20,
} as const;

export type AboutTreeItem = {
  name: string;
  children?: string[];
  filePath?: string;
};

export const ABOUT_TREE: Record<string, AboutTreeItem> = {
  profile: {
    name: "Profile",
    children: ["about"],
  },
  about: {
    name: "about.mdx",
    filePath: "content/about.mdx",
  },
  root: {
    name: "root",
    children: ["profile"],
  },
} as const;

export type AboutTree = typeof ABOUT_TREE;

export const ABOUT_TREE_CONFIG = {
  rootItemId: "root",
  defaultExpanded: ["root", "profile"],
  indent: 20,
} as const;
