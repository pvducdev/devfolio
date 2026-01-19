export const LAYOUT_CONFIG = {
  sidebar: {
    defaultSize: 20,
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
    defaultSize: undefined,
  },
  stretchLayout: false,
} as const;
