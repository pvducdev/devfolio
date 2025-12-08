import { GitCommitVertical, PanelsTopLeft, User } from "lucide-react";
import type { ComponentType, LazyExoticComponent } from "react";
import { lazy } from "react";
import {
  nav_main_about,
  nav_main_experience,
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
    name: nav_main_experience,
    key: "experience",
    icon: GitCommitVertical,
    sidebar: lazy(() => import("@/components/sidebar/work-experiences")),
  },
  {
    name: nav_main_projects,
    key: "projects",
    icon: PanelsTopLeft,
    sidebar: lazy(() => import("@/components/sidebar/projects")),
  },
];
