export const ROUTES = {
  HOME: "/home",
  ROOT: "/",
} as const;

const MOBILE_PREFIX = "/m";

export const MOBILE_ROUTES = {
  ABOUT: `${MOBILE_PREFIX}/about`,
  CAREER: `${MOBILE_PREFIX}/career`,
  HOME: `${MOBILE_PREFIX}/home`,
  PROJECTS: `${MOBILE_PREFIX}/projects`,
  PROJECT_DETAIL: `${MOBILE_PREFIX}/projects/$id`,
  SKILLS: `${MOBILE_PREFIX}/skills`,
} as const;

export type MobileRouteId = (typeof MOBILE_ROUTES)[keyof typeof MOBILE_ROUTES];

export const getRouteLabel = (path: string): string => `${path.slice(1)}.tsx`;

export const isValidTabRoute = (path: string): boolean =>
  path !== ROUTES.ROOT && path !== ROUTES.HOME;

const STATIC_MOBILE_ROUTES = new Set<string>(
  Object.values(MOBILE_ROUTES).filter(
    (route) => route !== MOBILE_ROUTES.PROJECT_DETAIL
  )
);

const isStaticMobileRoute = (pathname: string): pathname is MobileRouteId =>
  STATIC_MOBILE_ROUTES.has(pathname);

export const resolveRouteId = (pathname: string): MobileRouteId => {
  if (isStaticMobileRoute(pathname)) {
    return pathname;
  }
  if (pathname.startsWith(`${MOBILE_ROUTES.PROJECTS}/`)) {
    return MOBILE_ROUTES.PROJECT_DETAIL;
  }
  return MOBILE_ROUTES.HOME;
};

export const desktopToMobilePath = (pathname: string): string => {
  if (pathname === ROUTES.ROOT || pathname === ROUTES.HOME) {
    return MOBILE_ROUTES.HOME;
  }
  return `${MOBILE_PREFIX}${pathname}`;
};

export const mobileToDesktopPath = (pathname: string): string => {
  if (pathname === MOBILE_ROUTES.HOME) {
    return ROUTES.HOME;
  }
  return pathname.replace(MOBILE_PREFIX, "");
};
