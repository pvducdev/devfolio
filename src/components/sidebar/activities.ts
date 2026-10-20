import { GitCommitVertical, PanelsTopLeft, User } from "lucide-react";
import type { ComponentType, LazyExoticComponent } from "react";
import { lazy } from "react";

import {
  nav_main_about,
  nav_main_career,
  nav_main_projects,
} from "@/paraglide/messages.js";

export interface ActivityDefinition {
  name: () => string;
  key: string;
  icon: ComponentType;
  sidebar: LazyExoticComponent<ComponentType>;
}

export const activities: ActivityDefinition[] = [
  {
    icon: User,
    key: "about",
    name: nav_main_about,
    sidebar: lazy(() => import("./about")),
  },
  {
    icon: GitCommitVertical,
    key: "career",
    name: nav_main_career,
    sidebar: lazy(() => import("./career")),
  },
  {
    icon: PanelsTopLeft,
    key: "projects",
    name: nav_main_projects,
    sidebar: lazy(() => import("./projects")),
  },
];
