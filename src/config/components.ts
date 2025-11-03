export const TIMELINE_CONFIG = {
  defaultActiveStep: 3,
  variant: "default" as const,
} as const;

export const TREE_CONFIG = {
  indent: 20,
  enableHotkeys: true,
  enableSync: true,
} as const;

export const ASSISTANT_CONFIG = {
  maxMessageLength: 1000,
  enableSuggestions: true,
  placeholder: "Ask me about D...",
} as const;

export const PDF_VIEWER_CONFIG = {
  defaultZoom: 1,
  enableDownload: true,
  enablePrint: true,
} as const;
