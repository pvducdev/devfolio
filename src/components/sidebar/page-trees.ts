import type { ProjectCategory } from "@/config/projects";
import { PROJECTS } from "@/config/projects";

export interface PageTreeItem {
  name: string;
  children?: string[];
  path?: string;
}

export const ABOUT_TREE = {
  about: {
    name: "about.tsx",
    path: "/about",
  },
  profile: {
    children: ["about", "skills"],
    name: "Profile",
  },
  root: {
    children: ["profile"],
    name: "root",
  },
  skills: {
    name: "skills.tsx",
    path: "/skills",
  },
} as const satisfies Record<string, PageTreeItem>;

export const ABOUT_TREE_CONFIG = {
  defaultExpanded: ["root", "profile"],
  indent: 20,
  rootItemId: "root",
} as const;

const buildCategoryFolder = (
  category: ProjectCategory,
  name: string
): PageTreeItem => ({
  children: PROJECTS.filter((project) => project.category === category).map(
    (project) => project.id
  ),
  name,
});

const buildProjectFiles = (): Record<string, PageTreeItem> =>
  Object.fromEntries(
    PROJECTS.map((project) => [
      project.id,
      { name: `${project.id}.tsx`, path: `/projects/${project.id}` },
    ])
  );

export const PROJECT_TREE: Record<string, PageTreeItem> = {
  backend: buildCategoryFolder("backend", "Backend"),
  engineering: {
    children: ["frontend", "backend"],
    name: "Engineering",
  },
  frontend: buildCategoryFolder("frontend", "Frontend"),
  ...buildProjectFiles(),
};

export const PROJECT_TREE_CONFIG = {
  defaultExpanded: ["engineering", "frontend"],
  indent: 20,
  rootItemId: "engineering",
} as const;
