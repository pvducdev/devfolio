import { PanelsTopLeft, Route, User } from "lucide-react";
import type { ComponentType, LazyExoticComponent } from "react";
import { lazy } from "react";
import {
  nav_main_about,
  nav_main_career,
  nav_main_projects,
} from "@/paraglide/messages.js";

export type Activity = {
  name: () => string;
  key: string;
  icon: ComponentType;
  sidebar: LazyExoticComponent<ComponentType>;
};

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
    icon: Route,
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

export function getRouteLabel(path: string): string {
  return `${path.slice(1)}.tsx`;
}

export function isValidTabRoute(path: string): boolean {
  return path !== ROUTES.ROOT && path !== ROUTES.HOME;
}
