import type { MobileRouteId } from "@/config/routes";
import {
  mobile_dock_about,
  mobile_dock_back,
  mobile_dock_career,
  mobile_dock_contact,
  mobile_dock_linkedin,
  mobile_dock_live,
  mobile_dock_next,
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
        command: "ls projects/",
        id: "projects",
        label: mobile_dock_projects,
        listing: "> projects/",
        route: MOBILE_ROUTES.PROJECTS,
      },
      {
        command: "run skills_check.sh",
        id: "skills",
        label: mobile_dock_skills,
        listing: ">  skills_check.sh",
        route: MOBILE_ROUTES.SKILLS,
      },
      {
        command: "cat about_me.txt",
        id: "about",
        label: mobile_dock_about,
        listing: "> about_me.txt",
        route: MOBILE_ROUTES.ABOUT,
      },
      {
        command: "./view_career.sh",
        id: "career",
        label: mobile_dock_career,
        listing: "> view_career.sh",
        route: MOBILE_ROUTES.CAREER,
      },
    ],
  },

  [MOBILE_ROUTES.ABOUT]: {
    buttons: [
      { action: "back", command: "cd ..", id: "back", label: mobile_dock_back },
      {
        action: "resume",
        command: "open resume.pdf",
        id: "resume",
        label: mobile_dock_resume,
      },
      {
        action: "contact",
        command: "mail pvducc.dev@gmail.com",
        id: "contact",
        label: mobile_dock_contact,
      },
      {
        action: "linkedin",
        command: "open linkedin.com",
        id: "linkedin",
        label: mobile_dock_linkedin,
      },
    ],
  },

  [MOBILE_ROUTES.SKILLS]: {
    buttons: [
      { action: "back", command: "cd ..", id: "back", label: mobile_dock_back },
      {
        command: "ls projects/",
        id: "projects",
        label: mobile_dock_projects,
        route: MOBILE_ROUTES.PROJECTS,
      },
      {
        command: "cat about_me.txt",
        id: "about",
        label: mobile_dock_about,
        route: MOBILE_ROUTES.ABOUT,
      },
    ],
  },

  [MOBILE_ROUTES.CAREER]: {
    buttons: [
      { action: "back", command: "cd ..", id: "back", label: mobile_dock_back },
      {
        action: "resume",
        command: "open resume.pdf",
        id: "resume",
        label: mobile_dock_resume,
      },
      {
        action: "linkedin",
        command: "open linkedin.com",
        id: "linkedin",
        label: mobile_dock_linkedin,
      },
    ],
  },

  [MOBILE_ROUTES.PROJECTS]: {
    buttons: [
      { action: "back", command: "cd ..", id: "back", label: mobile_dock_back },
      {
        command: "run skills_check.sh",
        id: "skills",
        label: mobile_dock_skills,
        route: MOBILE_ROUTES.SKILLS,
      },
      {
        command: "./view_career.sh",
        id: "career",
        label: mobile_dock_career,
        route: MOBILE_ROUTES.CAREER,
      },
    ],
  },

  [MOBILE_ROUTES.PROJECT_DETAIL]: {
    buttons: [
      { action: "back", command: "cd ..", id: "back", label: mobile_dock_back },
      {
        action: "live",
        command: "open --live",
        id: "live",
        label: mobile_dock_live,
      },
      {
        action: "next",
        command: "next --project",
        id: "next",
        label: mobile_dock_next,
      },
    ],
  },
};
