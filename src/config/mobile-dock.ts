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

import { PERSONAL_INFO } from "./personal-info";
import { MOBILE_ROUTES } from "./routes";

export type DockAction =
  | "back"
  | "resume"
  | "contact"
  | "live"
  | "next"
  | "linkedin";

interface DockButtonBase {
  id: string;
  label: () => string;
  command: string;
  listing?: string;
}

export type DockButton = DockButtonBase &
  ({ route: MobileRouteId } | { action: DockAction });

const BACK: DockButton = {
  action: "back",
  command: "cd ..",
  id: "back",
  label: mobile_dock_back,
};

const PROJECTS: DockButton = {
  command: "ls projects/",
  id: "projects",
  label: mobile_dock_projects,
  route: MOBILE_ROUTES.PROJECTS,
};

const SKILLS: DockButton = {
  command: "run skills_check.sh",
  id: "skills",
  label: mobile_dock_skills,
  route: MOBILE_ROUTES.SKILLS,
};

const ABOUT: DockButton = {
  command: "cat about_me.txt",
  id: "about",
  label: mobile_dock_about,
  route: MOBILE_ROUTES.ABOUT,
};

const CAREER: DockButton = {
  command: "./view_career.sh",
  id: "career",
  label: mobile_dock_career,
  route: MOBILE_ROUTES.CAREER,
};

const RESUME: DockButton = {
  action: "resume",
  command: "open resume.pdf",
  id: "resume",
  label: mobile_dock_resume,
};

const CONTACT: DockButton = {
  action: "contact",
  command: `mail ${PERSONAL_INFO.contact.email}`,
  id: "contact",
  label: mobile_dock_contact,
};

const LINKEDIN: DockButton = {
  action: "linkedin",
  command: "open linkedin.com",
  id: "linkedin",
  label: mobile_dock_linkedin,
};

const LIVE: DockButton = {
  action: "live",
  command: "open --live",
  id: "live",
  label: mobile_dock_live,
};

const NEXT: DockButton = {
  action: "next",
  command: "next --project",
  id: "next",
  label: mobile_dock_next,
};

export const DOCK_BUTTONS: Record<MobileRouteId, DockButton[]> = {
  [MOBILE_ROUTES.HOME]: [
    { ...PROJECTS, listing: "> projects/" },
    { ...SKILLS, listing: ">  skills_check.sh" },
    { ...ABOUT, listing: "> about_me.txt" },
    { ...CAREER, listing: "> view_career.sh" },
  ],
  [MOBILE_ROUTES.ABOUT]: [BACK, RESUME, CONTACT, LINKEDIN],
  [MOBILE_ROUTES.SKILLS]: [BACK, PROJECTS, ABOUT],
  [MOBILE_ROUTES.CAREER]: [BACK, RESUME, LINKEDIN],
  [MOBILE_ROUTES.PROJECTS]: [BACK, SKILLS, CAREER],
  [MOBILE_ROUTES.PROJECT_DETAIL]: [BACK, LIVE, NEXT],
};
