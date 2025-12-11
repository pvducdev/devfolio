import { env } from "@/env";
import { ABOUT } from "./about";
import { PERSONAL_INFO } from "./personal-info";
import { SKILLS } from "./skills";

export const SITE_CONFIG = {
  title: env.VITE_APP_TITLE || "PVD Portfolio",
  description: ABOUT.shortBio,
  // biome-ignore lint/correctness/noUndeclaredVariables: <vite define>
  version: __APP_VERSION__,
  url: "https://your-domain.com",

  meta: {
    author: PERSONAL_INFO.name,
    keywords: [
      "portfolio",
      "frontend developer",
      ...SKILLS.core.map((s) => s.name.toLowerCase()),
      ...SKILLS.stack.map((s) => s.name.toLowerCase()),
    ],
    ogImage: "/og-image.png",
  },

  assistant: {
    name: "HeyD",
    model: "gemini-2.5-flash-lite",
    temperature: 2.0,
  },

  features: {
    showAssistant: true,
    showResumeViewer: true,
    showThemeSwitcher: true,
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
