export const ROUTES = {
  HOME: "/home",
  ROOT: "/",
} as const;

export const MOBILE_PREFIX = "/m";

export const MOBILE_ROUTES = {
  ABOUT: `${MOBILE_PREFIX}/about`,
  CAREER: `${MOBILE_PREFIX}/career`,
  HOME: `${MOBILE_PREFIX}/home`,
  PROJECTS: `${MOBILE_PREFIX}/projects`,
  PROJECT_DETAIL: `${MOBILE_PREFIX}/projects/$id`,
  SKILLS: `${MOBILE_PREFIX}/skills`,
} as const;

export type MobileRouteId = (typeof MOBILE_ROUTES)[keyof typeof MOBILE_ROUTES];
