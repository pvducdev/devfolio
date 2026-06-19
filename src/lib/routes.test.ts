import { describe, expect, it } from "vitest";

import { MOBILE_ROUTES, ROUTES } from "@/config/routes";
import {
  desktopToMobilePath,
  getRouteLabel,
  isValidTabRoute,
  mobileToDesktopPath,
  resolveRouteId,
} from "@/lib/routes";

describe("getRouteLabel", () => {
  it("strips the leading slash and appends .tsx", () => {
    expect(getRouteLabel("/about")).toBe("about.tsx");
  });
});

describe("isValidTabRoute", () => {
  it("rejects the root and home routes", () => {
    expect(isValidTabRoute(ROUTES.ROOT)).toBe(false);
    expect(isValidTabRoute(ROUTES.HOME)).toBe(false);
  });

  it("accepts any other route", () => {
    expect(isValidTabRoute("/about")).toBe(true);
  });
});

describe("resolveRouteId", () => {
  it("maps a known mobile route to itself", () => {
    expect(resolveRouteId(MOBILE_ROUTES.ABOUT)).toBe(MOBILE_ROUTES.ABOUT);
  });

  it("maps a project detail path to PROJECT_DETAIL", () => {
    expect(resolveRouteId("/m/projects/my-app")).toBe(
      MOBILE_ROUTES.PROJECT_DETAIL
    );
  });

  it("falls back to HOME for unknown paths", () => {
    expect(resolveRouteId("/unknown")).toBe(MOBILE_ROUTES.HOME);
  });
});

describe("desktopToMobilePath and mobileToDesktopPath", () => {
  it("round-trips a standard route", () => {
    expect(desktopToMobilePath("/about")).toBe(MOBILE_ROUTES.ABOUT);
    expect(mobileToDesktopPath(MOBILE_ROUTES.ABOUT)).toBe("/about");
  });

  it("maps both root and home to the mobile home route", () => {
    expect(desktopToMobilePath("/")).toBe(MOBILE_ROUTES.HOME);
    expect(desktopToMobilePath("/home")).toBe(MOBILE_ROUTES.HOME);
  });
});
