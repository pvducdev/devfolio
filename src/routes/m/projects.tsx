import { createFileRoute } from "@tanstack/react-router";

import { buildPageHead } from "@/components/seo/head";
import { nav_main_projects } from "@/paraglide/messages";

export const Route = createFileRoute("/m/projects")({
  head: () => buildPageHead("/projects", nav_main_projects()),
});
