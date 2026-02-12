import type { MobileRouteId } from "@/config/routes";
import {
  mobile_dock_about,
  mobile_dock_back,
  mobile_dock_career,
  mobile_dock_contact,
  mobile_dock_linkedin,
  mobile_dock_live,
  mobile_dock_projects,
  mobile_dock_resume,
  mobile_dock_skills,
} from "@/paraglide/messages";
import type { DockConfig } from "@/types/mobile";
import { MOBILE_ROUTES } from "./routes";

export const DOCK_BUTTONS: Record<MobileRouteId, DockConfig> = {
  [MOBILE_ROUTES.HOME]: {
    buttons: [
      {
        id: "projects",
        label: mobile_dock_projects,
        command: "ls projects/",
        route: MOBILE_ROUTES.PROJECTS,
        listing: "> projects/",
      },
      {
        id: "skills",
        label: mobile_dock_skills,
        command: "run skills_check.sh",
        route: MOBILE_ROUTES.SKILLS,
        listing: ">  skills_check.sh",
      },
      {
        id: "about",
        label: mobile_dock_about,
        command: "cat about_me.txt",
        route: MOBILE_ROUTES.ABOUT,
        listing: "> about_me.txt",
      },
      {
        id: "career",
        label: mobile_dock_career,
        command: "./view_career.sh",
        route: MOBILE_ROUTES.CAREER,
        listing: "> view_career.sh",
      },
    ],
  },

  [MOBILE_ROUTES.ABOUT]: {
    buttons: [
      { id: "back", label: mobile_dock_back, command: "cd ..", action: "back" },
      {
        id: "resume",
        label: mobile_dock_resume,
        command: "open resume.pdf",
        action: "resume",
      },
      {
        id: "contact",
        label: mobile_dock_contact,
        command: "mail pvducc.dev@gmail.com",
        action: "contact",
      },
      {
        id: "linkedin",
        label: mobile_dock_linkedin,
        command: "open linkedin.com",
        action: "linkedin",
      },
    ],
  },

  [MOBILE_ROUTES.SKILLS]: {
    buttons: [
      { id: "back", label: mobile_dock_back, command: "cd ..", action: "back" },
    ],
  },

  [MOBILE_ROUTES.CAREER]: {
    buttons: [
      { id: "back", label: mobile_dock_back, command: "cd ..", action: "back" },
    ],
  },

  [MOBILE_ROUTES.PROJECTS]: {
    buttons: [
      { id: "back", label: mobile_dock_back, command: "cd ..", action: "back" },
    ],
  },

  [MOBILE_ROUTES.PROJECT_DETAIL]: {
    buttons: [
      { id: "back", label: mobile_dock_back, command: "cd ..", action: "back" },
      {
        id: "live",
        label: mobile_dock_live,
        command: "open --live",
        action: "live",
      },
    ],
  },
};
