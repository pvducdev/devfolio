import { createFileRoute } from "@tanstack/react-router";
import CareerRunner from "@/components/career-runner/career-runner";
import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { nav_main_career } from "@/paraglide/messages";

export const Route = createFileRoute("/_root-layout/career")({
  head: () => ({
    meta: [{ title: `${nav_main_career()} | ${SITE_CONFIG.title}` }],
    links: buildCanonicalLink(`${SITE_CONFIG.url}/career`),
  }),
  component: CareerRunner,
});
