export const LAYOUT_CONFIG = {
  sidebar: {
    defaultSize: 25,
    minSize: 15,
    maxSize: 40,
    defaultSection: null,
  },
  panel: {
    defaultSize: 25,
    minSize: 15,
    maxSize: 40,
    defaultSection: "assistant",
  },
  editor: {
    defaultSize: 50,
  },
  stretchLayout: false,
} as const;

export type LayoutConfig = typeof LAYOUT_CONFIG;
