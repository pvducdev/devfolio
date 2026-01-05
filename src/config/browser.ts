import type Bowser from "bowser";

export const SUPPORTED_BROWSERS = {
  chrome: ">=111",
  chromium: ">=111",
  edge: ">=111",
  firefox: ">=117",
  safari: ">=18",
  opera: ">=97",
  vivaldi: ">=6.0",
  yandex: ">=23.3",
  naver: ">=3.20",
  electron: ">=25",
  focus: ">=117",
  librewolf: ">=117",
  uc: ">=15.5",
  qq: ">=13",
  qqlite: ">=13",
  epiphany: ">=44",
  seamonkey: ">=2.53",
  wechat: ">=8.0",
} satisfies Bowser.Parser.checkTree;
