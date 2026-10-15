import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import tanstack from "ultracite/oxlint/tanstack";

export default defineConfig({
  extends: [core, tanstack],
  ignorePatterns: [
    "dist/**",
    "coverage/**",
    "vendor/**",
    "test/snapshots/**",
    "src/routeTree.gen.ts",
    "/src/components/ui/*",
    "src/paraglide/*",
    ".wrangler/*",
    ".github/*",
  ],
});
