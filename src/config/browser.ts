import type Bowser from "bowser";

export const SUPPORTED_BROWSERS = {
  chrome: ">=111",
  chromium: ">=111",
  edge: ">=111",
  electron: ">=28",
  firefox: ">=121",
  opera: ">=105",
  safari: ">=16.4",
  vivaldi: ">=6.5",
} satisfies Bowser.Parser.checkTree;
