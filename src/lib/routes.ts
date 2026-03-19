import { MOBILE_PREFIX, MOBILE_ROUTES, ROUTES } from "@/config/routes";
import type { MobileRouteId } from "@/config/routes";

export function getRouteLabel(path: string): string {
  return `${path.slice(1)}.tsx`;
}

export function isValidTabRoute(path: string): boolean {
  return path !== ROUTES.ROOT && path !== ROUTES.HOME;
}

export function resolveRouteId(pathname: string): MobileRouteId {
  if (
    pathname.startsWith("/m/projects/") &&
    pathname !== MOBILE_ROUTES.PROJECTS
  ) {
    return MOBILE_ROUTES.PROJECT_DETAIL;
  }

  switch (pathname) {
    case MOBILE_ROUTES.HOME: {
      return MOBILE_ROUTES.HOME;
    }
    case MOBILE_ROUTES.ABOUT: {
      return MOBILE_ROUTES.ABOUT;
    }
    case MOBILE_ROUTES.SKILLS: {
      return MOBILE_ROUTES.SKILLS;
    }
    case MOBILE_ROUTES.CAREER: {
      return MOBILE_ROUTES.CAREER;
    }
    case MOBILE_ROUTES.PROJECTS: {
      return MOBILE_ROUTES.PROJECTS;
    }
    default: {
      return MOBILE_ROUTES.HOME;
    }
  }
}

export function desktopToMobilePath(pathname: string): string {
  if (pathname === "/" || pathname === "/home") {
    return MOBILE_ROUTES.HOME;
  }
  return `${MOBILE_PREFIX}${pathname}`;
}

export function mobileToDesktopPath(pathname: string): string {
  if (pathname === MOBILE_ROUTES.HOME) {
    return "/home";
  }
  return pathname.replace(MOBILE_PREFIX, "");
}
