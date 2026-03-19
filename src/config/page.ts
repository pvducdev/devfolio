export interface PageTreeItem {
  name: string;
  children?: string[];
  path?: string;
}

export const ABOUT_TREE: Record<string, PageTreeItem> = {
  about: {
    name: "about.tsx",
    path: "/about",
  },
  profile: {
    children: ["about", "skills"],
    name: "Profile",
  },
  root: {
    children: ["profile"],
    name: "root",
  },
  skills: {
    name: "skills.tsx",
    path: "/skills",
  },
} as const;

export const ABOUT_TREE_CONFIG = {
  defaultExpanded: ["root", "profile"],
  indent: 20,
  rootItemId: "root",
} as const;

export const PROJECT_TREE: Record<string, PageTreeItem> = {
  backend: {
    children: ["ieltsy-bot", "daily-tech-bot"],
    name: "Backend",
  },
  "daily-tech-bot": {
    name: "daily-tech-bot.tsx",
    path: "/projects/daily-tech-bot",
  },
  engineering: {
    children: ["frontend", "backend"],
    name: "Engineering",
  },
  frontend: {
    children: ["portfolio"],
    name: "Frontend",
  },
  "ieltsy-bot": {
    name: "ieltsy-bot.tsx",
    path: "/projects/ieltsy-bot",
  },
  portfolio: {
    name: "portfolio.tsx",
    path: "/projects/portfolio",
  },
} as const;

export const PROJECT_TREE_CONFIG = {
  defaultExpanded: ["engineering", "frontend"],
  indent: 20,
  rootItemId: "engineering",
} as const;
