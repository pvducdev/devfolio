import { env } from "@/env/client";

import { PERSONAL_INFO } from "./personal-info";
import { SKILLS } from "./skills";

export const SITE_CONFIG = {
  assistant: {
    model: "openai/gpt-oss-120b",
    name: "HeyD",
    temperature: 0.7,
  },
  cache: {
    maxAge: 86_400,
    staleWhileRevalidate: 604_800,
  },
  description: PERSONAL_INFO.bio,
  features: {
    showAssistant: true,
    showRepoStars: true,
    showResumeViewer: true,
    showThemeSwitcher: true,
  },

  meta: {
    author: PERSONAL_INFO.name,
    keywords: [
      "portfolio",
      "frontend developer",
      ...SKILLS.core.map((s) => s.name.toLowerCase()),
      ...SKILLS.stack.map((s) => s.name.toLowerCase()),
    ],
    ogImage:
      "https://res.cloudinary.com/d-devfolio/image/upload/w_1200,h_630,c_fill,q_auto,f_auto/devfolio_ai_uhrs0v.png",
    ogImageHeight: "630",
    ogImageWidth: "1200",
    ogType: "website",
    twitterCard: "summary_large_image",
  },

  rateLimit: {
    maxRequests: 100,
    windowMs: 60_000,
  },

  repository: {
    name: "devfolio",
    owner: "pvducdev",
    url: "https://github.com/pvducdev/devfolio",
  },

  title: env.VITE_APP_TITLE || "PVD Portfolio",

  url: env.VITE_BASE_URL || "",

  version: __APP_VERSION__,
} as const;

export type SiteConfig = typeof SITE_CONFIG;
