export type ProjectConfig = {
  id: string;
  name: string;
  description: string;
  guides: { title: string; src: string; type: "screenshot" | "video" }[];
  package: Record<string, unknown>;
};

export const PROJECTS: ProjectConfig[] = [
  {
    id: "portfolio",
    name: "Portfolio Site",
    description: "Personal portfolio built with TanStack Start",
    guides: [
      {
        src: "https://placehold.co/900x1600?text=Loading",
        type: "screenshot",
        title: "Loading",
      },
      {
        src: "https://placehold.co/900x1600?text=Hello+World",
        type: "screenshot",
        title: "Hello",
      },
      {
        src: "https://placehold.co/900x1600?text=Finish",
        type: "screenshot",
        title: "Finish",
      },
    ],
    package: {
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
