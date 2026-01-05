import { createIsomorphicFn } from "@tanstack/react-start";
import Bowser from "bowser";

const SUPPORTED_BROWSERS = {
  chrome: ">=111",
  edge: ">=111",
  firefox: ">=117",
  safari: ">=18",
  mobile: {
    chrome: ">=111",
    safari: ">=18",
    firefox: ">=117",
  },
} satisfies Bowser.Parser.checkTree;

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
