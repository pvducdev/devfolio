import { env } from "@/env/client";
import { PERSONAL_INFO } from "./personal-info";
import { SKILLS } from "./skills";

export const SITE_CONFIG = {
  title: env.VITE_APP_TITLE || "PVD Portfolio",
  description: PERSONAL_INFO.bio,
  // biome-ignore lint/correctness/noUndeclaredVariables: <vite define>
  version: __APP_VERSION__,
  url: env.VITE_BASE_URL || "",

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
    ogImageWidth: "1200",
    ogImageHeight: "630",
    ogType: "website",
    twitterCard: "summary_large_image",
  },

  assistant: {
    name: "HeyD",
    model: "openai/gpt-oss-120b",
    temperature: 0.7,
  },

  repository: {
    owner: "pvducdev",
    name: "devfolio",
    url: "https://github.com/pvducdev/devfolio",
  },

  features: {
    showAssistant: true,
    showResumeViewer: true,
    showThemeSwitcher: true,
    showRepoStars: true,
  },

  rateLimit: {
    maxRequests: 100,
    windowMs: 60_000,
  },

  cache: {
    maxAge: 86_400,
    staleWhileRevalidate: 604_800,
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
