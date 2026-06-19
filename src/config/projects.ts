import { SITE_CONFIG } from "@/config/site";

interface ProjectPackage {
  name: string;
  description: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface ProjectConfig {
  id: string;
  name: string;
  description: string;
  url: string;
  type: "mobile" | "desktop";
  guides: { title: string; src: string; type: "screenshot" | "video" }[];
  package: ProjectPackage;
}

export const PROJECTS: ProjectConfig[] = [
  {
    description: "Personal portfolio built with TanStack Start",
    guides: [
      {
        src: "https://res.cloudinary.com/d-devfolio/image/upload/f_auto/Screenshot_2026-01-14_at_22.07.40_asegno.png",
        title: "Starter",
        type: "screenshot",
      },
      {
        src: "https://res.cloudinary.com/d-devfolio/image/upload/f_auto/Screenshot_2026-01-14_at_22.17.17_x6hsej.jpg",
        title: "About",
        type: "screenshot",
      },
      {
        src: "https://res.cloudinary.com/d-devfolio/image/upload/f_auto/Screenshot_2026-01-14_at_22.17.29_vskgg2.png",
        title: "Skill",
        type: "screenshot",
      },
      {
        src: "https://res.cloudinary.com/d-devfolio/image/upload/f_auto/Screenshot_2026-01-14_at_22.17.40_aymati.png",
        title: "Career",
        type: "screenshot",
      },
    ],
    id: "portfolio",
    name: "Portfolio Site",
    package: {
      dependencies: {
        "@google/genai": "^0.x.x",
        "@inlang/paraglide-js": "^2.x.x",
        "@tanstack/react-router": "^1.x.x",
        "@tanstack/react-start": "^1.x.x",
        "class-variance-authority": "^0.x.x",
        motion: "^12.x.x",
        react: "^19.x.x",
        tailwindcss: "^4.x.x",
        valibot: "^1.x.x",
        zustand: "^5.x.x",
      },
      description: "Personal portfolio built with TanStack Start",
      devDependencies: {
        "@biomejs/biome": "^2.x.x",
        typescript: "^5.x.x",
        vite: "^7.x.x",
        vitest: "^4.x.x",
      },
      name: "devfolio",
    },
    type: "desktop",
    url: SITE_CONFIG.url,
  },
  {
    description: "Learning english by games using Telegram bot",
    guides: [
      {
        src: "https://res.cloudinary.com/d-devfolio/image/upload/f_auto/Screenshot_2026-01-14_at_22.27.05_ptervq.png",
        title: "Starter",
        type: "screenshot",
      },
      {
        src: "https://res.cloudinary.com/d-devfolio/image/upload/f_auto/Screenshot_2026-01-14_at_22.53.15_f0b1fm.png",
        title: "Q&A - English quiz",
        type: "screenshot",
      },
      {
        src: "https://res.cloudinary.com/d-devfolio/image/upload/f_auto/Screenshot_2026-01-14_at_22.53.46_saihxj.png",
        title: "Chain - Word Chain Game",
        type: "screenshot",
      },
      {
        src: "https://res.cloudinary.com/d-devfolio/image/upload/f_auto/Screenshot_2026-01-14_at_22.55.19_tva7yr.png",
        title: "Jumble - Word Jumble Game",
        type: "screenshot",
      },
    ],
    id: "ieltsy-bot",
    name: "Ieltsy Bot",
    package: {
      dependencies: {
        "@nestjs/core": "^11.x.x",
        "@nestjs/throttler": "^6.x.x",
        "groq-sdk": "^0.x.x",
        telegraf: "^4.x.x",
      },
      description: "Learning english by games using Telegram bot",
      devDependencies: {
        eslint: "^9.x.x",
        jest: "^29.x.x",
        typescript: "^5.x.x",
      },
      name: "ieltsy-bot",
    },
    type: "mobile",
    url: "https://t.me/pvd_stuff_bot",
  },
  {
    description:
      "Daily notification favorite package release and tech news using Vercel Cronjob",
    guides: [
      {
        src: "https://res.cloudinary.com/d-devfolio/image/upload/f_auto/Screenshot_2026-01-14_at_22.31.31_ge3wjd.png",
        title: "Usage",
        type: "screenshot",
      },
    ],
    id: "daily-tech-bot",
    name: "Daily Telegram Bot for Tech News & Package Release",
    package: {
      dependencies: {
        "node-telegram-bot-api": "^0.x.x",
        redis: "^5.x.x",
      },
      description:
        "Daily notification favorite package release and tech news using Vercel Cronjob",
      devDependencies: {
        typescript: "^5.x.x",
        vercel: "^48.x.x",
      },
      name: "daily-tech-bot",
    },
    type: "mobile",
    url: "https://t.me/d_stupid_bot",
  },
];

export const getProjectById = (id: string): ProjectConfig =>
  PROJECTS.find((p) => p.id === id) || ({} as ProjectConfig);

export const getNextProjectId = (currentId: string): string => {
  const index = PROJECTS.findIndex((p) => p.id === currentId);
  const next = (index + 1) % PROJECTS.length;
  return PROJECTS[next].id;
};

export const getProjectIndex = (id: string): number =>
  PROJECTS.findIndex((p) => p.id === id);
