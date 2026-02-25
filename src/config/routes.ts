import { GitCommitVertical, PanelsTopLeft, User } from "lucide-react";
import type { ComponentType, LazyExoticComponent } from "react";
import { lazy } from "react";
import {
  nav_main_about,
  nav_main_career,
  nav_main_projects,
} from "@/paraglide/messages.js";

export interface Activity {
  name: () => string;
  key: string;
  icon: ComponentType;
  sidebar: LazyExoticComponent<ComponentType>;
}

export const activities: Activity[] = [
  {
    name: nav_main_about,
    key: "about",
    icon: User,
    sidebar: lazy(() => import("@/components/sidebar/about")),
  },
  {
    name: nav_main_career,
    key: "career",
    icon: GitCommitVertical,
    sidebar: lazy(() => import("@/components/sidebar/career")),
  },
  {
    name: nav_main_projects,
    key: "projects",
    icon: PanelsTopLeft,
    sidebar: lazy(() => import("@/components/sidebar/projects")),
  },
];

export const ROUTES = {
  ROOT: "/",
  HOME: "/home",
} as const;

export const MOBILE_PREFIX = "/m";

export const MOBILE_ROUTES = {
  HOME: `${MOBILE_PREFIX}/home`,
  ABOUT: `${MOBILE_PREFIX}/about`,
  SKILLS: `${MOBILE_PREFIX}/skills`,
  CAREER: `${MOBILE_PREFIX}/career`,
  PROJECTS: `${MOBILE_PREFIX}/projects`,
  PROJECT_DETAIL: `${MOBILE_PREFIX}/projects/$id`,
} as const;

export type MobileRouteId = (typeof MOBILE_ROUTES)[keyof typeof MOBILE_ROUTES];
