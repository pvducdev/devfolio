import { createFileRoute } from "@tanstack/react-router";

import { buildPageHead } from "@/config/seo";
import { nav_main_projects } from "@/paraglide/messages";

export const Route = createFileRoute("/m/projects")({
  head: () => buildPageHead("/projects", nav_main_projects()),
});
