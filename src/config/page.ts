export interface PageTreeItem {
  name: string;
  children?: string[];
  path?: string;
}

export const ABOUT_TREE: Record<string, PageTreeItem> = {
  root: {
    name: "root",
    children: ["profile"],
  },
  profile: {
    name: "Profile",
    children: ["about", "skills"],
  },
  about: {
    name: "about.tsx",
    path: "/about",
  },
  skills: {
    name: "skills.tsx",
    path: "/skills",
  },
} as const;

export const ABOUT_TREE_CONFIG = {
  rootItemId: "root",
  defaultExpanded: ["root", "profile"],
  indent: 20,
} as const;

export const PROJECT_TREE: Record<string, PageTreeItem> = {
  engineering: {
    name: "Engineering",
    children: ["frontend", "backend"],
  },
  frontend: {
    name: "Frontend",
    children: ["portfolio"],
  },
  portfolio: {
    name: "portfolio.tsx",
    path: "/projects/portfolio",
  },
  backend: {
    name: "Backend",
    children: ["ieltsy-bot", "daily-tech-bot"],
  },
  "ieltsy-bot": {
    name: "ieltsy-bot.tsx",
    path: "/projects/ieltsy-bot",
  },
  "daily-tech-bot": {
    name: "daily-tech-bot.tsx",
    path: "/projects/daily-tech-bot",
  },
} as const;

export const PROJECT_TREE_CONFIG = {
  rootItemId: "engineering",
  defaultExpanded: ["engineering", "frontend"],
  indent: 20,
} as const;
