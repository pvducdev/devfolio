import { createFileRoute } from "@tanstack/react-router";

import AboutPage from "@/components/about";
import { buildPageHead } from "@/config/seo";
import { nav_main_about } from "@/paraglide/messages";

export const Route = createFileRoute("/_root-layout/about")({
  component: AboutPage,
  head: () => buildPageHead("/about", nav_main_about()),
});
