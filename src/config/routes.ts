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
    icon: User,
    key: "about",
    name: nav_main_about,
    sidebar: lazy(() => import("@/components/sidebar/about")),
  },
  {
    icon: GitCommitVertical,
    key: "career",
    name: nav_main_career,
    sidebar: lazy(() => import("@/components/sidebar/career")),
  },
  {
    icon: PanelsTopLeft,
    key: "projects",
    name: nav_main_projects,
    sidebar: lazy(() => import("@/components/sidebar/projects")),
  },
];

export const ROUTES = {
  HOME: "/home",
  ROOT: "/",
} as const;

export const MOBILE_PREFIX = "/m";

export const MOBILE_ROUTES = {
  ABOUT: `${MOBILE_PREFIX}/about`,
  CAREER: `${MOBILE_PREFIX}/career`,
  HOME: `${MOBILE_PREFIX}/home`,
  PROJECTS: `${MOBILE_PREFIX}/projects`,
  PROJECT_DETAIL: `${MOBILE_PREFIX}/projects/$id`,
  SKILLS: `${MOBILE_PREFIX}/skills`,
} as const;

export type MobileRouteId = (typeof MOBILE_ROUTES)[keyof typeof MOBILE_ROUTES];
