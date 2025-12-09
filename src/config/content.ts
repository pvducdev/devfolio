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
    children: ["about", "skills"],
  },
  about: {
    name: "about.mdx",
    filePath: "content/about.mdx",
  },
  skills: {
    name: "skills.mdx",
    filePath: "content/skills.mdx",
  },
  root: {
    name: "root",
    children: ["profile"],
  },
} as const;

export const ABOUT_TREE_CONFIG = {
  rootItemId: "root",
  defaultExpanded: ["root", "profile"],
  indent: 20,
} as const;
