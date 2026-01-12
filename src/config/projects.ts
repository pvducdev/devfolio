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
        src: "https://placehold.co/900x1600?text=Hello+World",
        type: "screenshot",
        title: "Starter",
      },
      {
        src: "https://picsum.photos/seed/picsum/200/300.webp",
        type: "screenshot",
        title: "About",
      },
      {
        src: "https://picsum.photos/seed/picsum/200/300.webp",
        type: "screenshot",
        title: "Skill",
      },
      {
        src: "https://picsum.photos/seed/picsum/200/300.webp",
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
        src: "https://placehold.co/900x1600?text=Hello+World",
        type: "screenshot",
        title: "Starter",
      },
      {
        src: "https://picsum.photos/seed/picsum/200/300.webp",
        type: "screenshot",
        title: "Q&A - English quiz",
      },
      {
        src: "https://picsum.photos/seed/picsum/200/300.webp",
        type: "screenshot",
        title: "Chain - Word Chain Game",
      },
      {
        src: "https://picsum.photos/seed/picsum/200/300.webp",
        type: "screenshot",
        title: "Jumble - Word Jumble Game",
      },
      {
        src: "https://picsum.photos/seed/picsum/200/300.webp",
        type: "screenshot",
        title: "Idioms - Emoji Idioms game",
      },
      {
        src: "https://picsum.photos/seed/picsum/200/300.webp",
        type: "screenshot",
        title: "Help - Help commands",
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
        src: "https://placehold.co/900x1600?text=Hello+World",
        type: "screenshot",
        title: "Usage",
      },
    ],
    package: {
      name: "ieltsy-bot",
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
