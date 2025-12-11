export type ProjectConfig = {
  id: string;
  name: string;
  description: string;
  screenshotSrc: string;
  videoSrc?: string;
  codeFilename: string;
  packageJson: Record<string, unknown>;
};

export const PROJECTS: ProjectConfig[] = [
  {
    id: "portfolio",
    name: "Portfolio Site",
    description: "Personal portfolio built with TanStack Start",
    screenshotSrc: "https://placehold.co/900x1600?text=Hello+World",
    codeFilename: "package.json",
    packageJson: {
      name: "portfolio-site",
      description: "Personal portfolio built with TanStack Start",
      dependencies: {
        react: "^19.2.0",
        "@tanstack/react-router": "^1.x.x",
        zustand: "^5.x.x",
      },
      devDependencies: {
        typescript: "^5.x.x",
        vite: "^6.x.x",
        tailwindcss: "^4.x.x",
        biome: "^1.x.x",
      },
    },
  },
];

export function getProjectById(id: string): ProjectConfig | undefined {
  return PROJECTS.find((p) => p.id === id);
}
