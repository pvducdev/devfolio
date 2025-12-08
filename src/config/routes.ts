import { GitCommitVertical, PanelsTopLeft, User } from "lucide-react";
import type { ComponentType, LazyExoticComponent } from "react";
import { lazy } from "react";
import {
  nav_about,
  nav_experience,
  nav_projects,
} from "@/paraglide/messages.js";

export type Activity = {
  name: () => string;
  key: string;
  icon: ComponentType;
  sidebar: LazyExoticComponent<ComponentType>;
};

export const activities: Activity[] = [
  {
    name: nav_about,
    key: "about",
    icon: User,
    sidebar: lazy(() => import("@/components/sidebar/about")),
  },
  {
    name: nav_experience,
    key: "experience",
    icon: GitCommitVertical,
    sidebar: lazy(() => import("@/components/sidebar/work-experiences")),
  },
  {
    name: nav_projects,
    key: "projects",
    icon: PanelsTopLeft,
    sidebar: lazy(() => import("@/components/sidebar/projects")),
  },
];
