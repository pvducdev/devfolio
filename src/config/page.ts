import { type ComponentType, type LazyExoticComponent, lazy } from "react";

const AboutPage = lazy(() => import("@/components/about"));
const SkillsPage = lazy(() => import("@/components/skills"));
const CareerPage = lazy(
  () => import("@/components/career-runner/career-runner")
);
const ProjectsPage = lazy(() => import("@/components/project"));

export type PageTreeItem = {
  name: string;
  children?: string[];
  page?: LazyExoticComponent<ComponentType>;
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
    page: AboutPage,
  },
  skills: {
    name: "skills.tsx",
    page: SkillsPage,
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
    name: "projects.tsx",
    page: ProjectsPage,
  },
  "project-2-frontend": {
    name: "projects.tsx",
    page: ProjectsPage,
  },
  "project-3-frontend": {
    name: "projects.tsx",
    page: ProjectsPage,
  },
  backend: {
    name: "Backend",
    children: ["project-1-backend", "project-2-backend"],
  },
  "project-1-backend": {
    name: "projects.tsx",
    page: ProjectsPage,
  },
  "project-2-backend": {
    name: "projects.tsx",
    page: ProjectsPage,
  },
} as const;

export const PROJECT_TREE_CONFIG = {
  rootItemId: "engineering",
  defaultExpanded: ["engineering", "frontend"],
  indent: 20,
} as const;

export const CAREER_PAGE = CareerPage;

export function getPageComponent(
  pageId: string
): LazyExoticComponent<ComponentType> | undefined {
  if (pageId === "career") {
    return CAREER_PAGE;
  }
  return ABOUT_TREE[pageId]?.page || PROJECT_TREE[pageId]?.page;
}
