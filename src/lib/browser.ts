import { createIsomorphicFn } from "@tanstack/react-start";
import Bowser from "bowser";

import { SUPPORTED_BROWSERS } from "@/config/browser";

export const isMac = createIsomorphicFn()
  .server(() => false)
  .client(() => Bowser.getParser(navigator.userAgent).getOSName() === "macOS");

export const isMobile = createIsomorphicFn()
  .server(() => false)
  .client(
    () => Bowser.getParser(navigator.userAgent).getPlatformType() === "mobile"
  );

export const isSupportedBrowser = createIsomorphicFn()
  .server(() => false)
  .client(
    () =>
      Bowser.getParser(navigator.userAgent).satisfies(SUPPORTED_BROWSERS) ??
      false
  );
