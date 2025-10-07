import { ChartNoAxesGantt, Code, PanelsTopLeft, User } from "lucide-react";

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
    icon: ChartNoAxesGantt,
    hasSidebar: true,
  },
  {
    name: "Skills",
    path: "/skills",
    icon: Code,
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
