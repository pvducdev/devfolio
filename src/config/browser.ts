import type Bowser from "bowser";

export const SUPPORTED_BROWSERS = {
  chrome: ">=111",
  chromium: ">=111",
  edge: ">=111",
  firefox: ">=121",
  safari: ">=16.4",
  opera: ">=105",
  vivaldi: ">=6.5",
  electron: ">=28",
} satisfies Bowser.Parser.checkTree;
