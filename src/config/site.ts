import { env } from "@/env/client";

import { PERSONAL_INFO } from "./personal-info";
import { SKILLS } from "./skills";

export const SITE_CONFIG = {
  assistant: {
    name: "HeyD",
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

  repository: {
    name: "devfolio",
    owner: "pvducdev",
    url: "https://github.com/pvducdev/devfolio",
  },

  title: env.VITE_APP_TITLE,

  url: env.VITE_BASE_URL,

  version: __APP_VERSION__,
} as const;
