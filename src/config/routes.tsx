import { CodeXml, GitCommitVertical, PanelsTopLeft, User } from "lucide-react";

export const activities = [
  {
    name: "About me",
    path: "/about",
    icon: User,
    hasSidebar: true,
  },
  {
    name: "Experience",
    path: "/experience",
    icon: GitCommitVertical,
    hasSidebar: true,
  },
  {
    name: "Skills",
    path: "/skills",
    icon: CodeXml,
    hasSidebar: true,
  },
  {
    name: "Projects",
    path: "/projects",
    icon: PanelsTopLeft,
    hasSidebar: true,
  },
];

export type Activity = (typeof activities)[number];
