import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";
import packageJson from "./package.json" with { type: "json" };

const config = defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    // MDX must run in pre phase before React plugin
    // This ensures MDX files are transformed to JSX before React processes them
    {
      enforce: "pre",
      ...mdx({
        // Point to our custom useMDXComponents implementation
        // Using absolute path from project root
        providerImportSource: "/src/mdx-components",
      }),
    },
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
