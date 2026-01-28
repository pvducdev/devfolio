import { createFileRoute } from "@tanstack/react-router";
import AboutPage from "@/components/about";
import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { nav_main_about } from "@/paraglide/messages";

export const Route = createFileRoute("/_root-layout/about")({
  head: () => ({
    meta: [{ title: `${nav_main_about()} | ${SITE_CONFIG.title}` }],
    links: buildCanonicalLink(`${SITE_CONFIG.url}/about`),
  }),
  component: AboutPage,
});
