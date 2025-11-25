import { GitCommitVertical, PanelsTopLeft, User } from "lucide-react";
import { lazy } from "react";

export const activities = [
  {
    name: "About me",
    key: "about",
    icon: User,
    sidebar: lazy(() => import("@/components/sidebar/about")),
  },
  {
    name: "Experience",
    key: "experience",
    icon: GitCommitVertical,
    sidebar: lazy(() => import("@/components/sidebar/work-experiences")),
  },
  {
    name: "Projects",
    key: "projects",
    icon: PanelsTopLeft,
    sidebar: lazy(() => import("@/components/sidebar/projects")),
  },
] as const;

export type Activity = (typeof activities)[number];
