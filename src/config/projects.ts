import { SITE_CONFIG } from "@/config/site.ts";

export interface ProjectConfig {
  id: string;
  name: string;
  description: string;
  url: string;
  type: "mobile" | "desktop";
  guides: { title: string; src: string; type: "screenshot" | "video" }[];
  package: Record<string, unknown>;
}

export const PROJECTS: ProjectConfig[] = [
  {
    id: "portfolio",
    name: "Portfolio Site",
    description: "Personal portfolio built with TanStack Start",
    type: "desktop",
    url: SITE_CONFIG.url,
    guides: [
      {
        src: "https://res.cloudinary.com/dwzyai9vb/image/upload/f_auto/Screenshot_2026-01-14_at_22.07.40_asegno.png",
        type: "screenshot",
        title: "Starter",
      },
      {
        src: "https://res.cloudinary.com/dwzyai9vb/image/upload/f_auto/Screenshot_2026-01-14_at_22.17.17_x6hsej.jpg",
        type: "screenshot",
        title: "About",
      },
      {
        src: "https://res.cloudinary.com/dwzyai9vb/image/upload/f_auto/Screenshot_2026-01-14_at_22.17.29_vskgg2.png",
        type: "screenshot",
        title: "Skill",
      },
      {
        src: "https://res.cloudinary.com/dwzyai9vb/image/upload/f_auto/Screenshot_2026-01-14_at_22.17.40_aymati.png",
        type: "screenshot",
        title: "Career",
      },
    ],
    package: {
      name: "zxc",
      description: "Personal portfolio built with TanStack Start",
      dependencies: {
        react: "^19.x.x",
        "@tanstack/react-router": "^1.x.x",
        "@tanstack/react-start": "^1.x.x",
        zustand: "^5.x.x",
        "@google/genai": "^0.x.x",
        tailwindcss: "^4.x.x",
        valibot: "^1.x.x",
        motion: "^12.x.x",
        "@inlang/paraglide-js": "^2.x.x",
        "class-variance-authority": "^0.x.x",
      },
      devDependencies: {
        typescript: "^5.x.x",
        vite: "^7.x.x",
        "@biomejs/biome": "^2.x.x",
        vitest: "^4.x.x",
      },
    },
  },
  {
    id: "ieltsy-bot",
    name: "Ieltsy Bot",
    description: "Learning english by games using Telegram bot",
    type: "mobile",
    url: "https://t.me/pvd_stuff_bot",
    guides: [
      {
        src: "https://res.cloudinary.com/dwzyai9vb/image/upload/f_auto/Screenshot_2026-01-14_at_22.27.05_ptervq.png",
        type: "screenshot",
        title: "Starter",
      },
      {
        src: "https://res.cloudinary.com/dwzyai9vb/image/upload/f_auto/Screenshot_2026-01-14_at_22.53.15_f0b1fm.png",
        type: "screenshot",
        title: "Q&A - English quiz",
      },
      {
        src: "https://res.cloudinary.com/dwzyai9vb/image/upload/f_auto/Screenshot_2026-01-14_at_22.53.46_saihxj.png",
        type: "screenshot",
        title: "Chain - Word Chain Game",
      },
      {
        src: "https://res.cloudinary.com/dwzyai9vb/image/upload/f_auto/Screenshot_2026-01-14_at_22.55.19_tva7yr.png",
        type: "screenshot",
        title: "Jumble - Word Jumble Game",
      },
    ],
    package: {
      name: "ieltsy-bot",
      description: "Learning english by games using Telegram bot",
      dependencies: {
        "@nestjs/core": "^11.x.x",
        "groq-sdk": "^0.x.x",
        "@nestjs/throttler": "^6.x.x",
        telegraf: "^4.x.x",
      },
      devDependencies: {
        typescript: "^5.x.x",
        eslint: "^9.x.x",
        jest: "^29.x.x",
      },
    },
  },
  {
    id: "daily-tech-bot",
    name: "Daily Telegram Bot for Tech News & Package Release",
    description:
      "Daily notification favorite package release and tech news using Vercel Cronjob",
    type: "mobile",
    url: "https://t.me/d_stupid_bot",
    guides: [
      {
        src: "https://res.cloudinary.com/dwzyai9vb/image/upload/f_auto/Screenshot_2026-01-14_at_22.31.31_ge3wjd.png",
        type: "screenshot",
        title: "Usage",
      },
    ],
    package: {
      name: "daily-tech-bot",
      description:
        "Daily notification favorite package release and tech news using Vercel Cronjob",
      dependencies: {
        "node-telegram-bot-api": "^0.x.x",
        redis: "^5.x.x",
      },
      devDependencies: {
        typescript: "^5.x.x",
        vercel: "^48.x.x",
      },
    },
  },
];

export function getProjectById(id: string): ProjectConfig {
  return PROJECTS.find((p) => p.id === id) || ({} as ProjectConfig);
}
