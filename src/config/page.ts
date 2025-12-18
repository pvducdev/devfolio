export type PageTreeItem = {
  name: string;
  children?: string[];
  path?: string;
};

export const ABOUT_TREE: Record<string, PageTreeItem> = {
  root: {
    name: "root",
    children: ["profile"],
  },
  profile: {
    name: "Profile",
    children: ["about", "skills"],
  },
  about: {
    name: "about.tsx",
    path: "/about",
  },
  skills: {
    name: "skills.tsx",
    path: "/skills",
  },
} as const;

export const ABOUT_TREE_CONFIG = {
  rootItemId: "root",
  defaultExpanded: ["root", "profile"],
  indent: 20,
} as const;

export const PROJECT_TREE: Record<string, PageTreeItem> = {
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
    name: "project-1-frontend.tsx",
    path: "/projects/project-1-frontend",
  },
  "project-2-frontend": {
    name: "projects.tsx",
    path: "/projects/project-2-frontend",
  },
  "project-3-frontend": {
    name: "projects.tsx",
    path: "/projects/project-3-frontend",
  },
  backend: {
    name: "Backend",
    children: ["project-1-backend", "project-2-backend"],
  },
  "project-1-backend": {
    name: "projects.tsx",
    path: "/projects/project-1-backend",
  },
  "project-2-backend": {
    name: "projects.tsx",
    path: "/projects/project-2-backend",
  },
} as const;

export const PROJECT_TREE_CONFIG = {
  rootItemId: "engineering",
  defaultExpanded: ["engineering", "frontend"],
  indent: 20,
} as const;
