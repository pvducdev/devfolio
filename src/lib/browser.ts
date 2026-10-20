import { createIsomorphicFn } from "@tanstack/react-start";
import Bowser from "bowser";

const SUPPORTED_BROWSERS = {
  chrome: ">=111",
  chromium: ">=111",
  edge: ">=111",
  electron: ">=28",
  firefox: ">=121",
  opera: ">=105",
  safari: ">=16.4",
  vivaldi: ">=6.5",
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

export const isServer = createIsomorphicFn()
  .server(() => true)
  .client(() => false);
