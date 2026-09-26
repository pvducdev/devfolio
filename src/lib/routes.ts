import { MOBILE_PREFIX, MOBILE_ROUTES, ROUTES } from "@/config/routes";
import type { MobileRouteId } from "@/config/routes";

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
