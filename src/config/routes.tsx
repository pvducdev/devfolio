import { CodeXml, GitCommitVertical, PanelsTopLeft, User } from "lucide-react";

export const activities = [
  {
    name: "About me",
    key: "about",
    icon: User,
  },
  {
    name: "Experience",
    key: "experience",
    icon: GitCommitVertical,
  },
  {
    name: "Skills",
    key: "skills",
    icon: CodeXml,
  },
  {
    name: "Projects",
    key: "projects",
    icon: PanelsTopLeft,
  },
];

export type Activity = (typeof activities)[number];
