import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { ROUTES } from "@/config/routes.ts";
import packageJson from "./package.json" with { type: "json" };
import { PROJECTS } from "./src/config/projects";

const config = defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  assetsInclude: ["**/*.wasm"],
  plugins: [
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      outputStructure: "message-modules",
      cookieName: "PARAGLIDE_LOCALE",
      strategy: ["cookie", "preferredLanguage", "baseLocale"],
    }),
    tanstackStart({
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: true,
        crawlLinks: true,
        concurrency: 10,
        failOnError: true,
        filter: ({ path }) => !path.startsWith("/about"),
      },
      pages: [
        { path: ROUTES.HOME },
        ...PROJECTS.map((p) => ({ path: `/projects/${p.id}` })),
      ],
    }),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  ssr: {
    noExternal: ["streamdown"],
  },
});

export default config;
