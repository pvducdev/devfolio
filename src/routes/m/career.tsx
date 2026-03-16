import { createFileRoute } from "@tanstack/react-router";
import CareerTimeline from "@/components/career/mobile/career-timeline";
import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { nav_main_career } from "@/paraglide/messages";

export const Route = createFileRoute("/m/career")({
  head: () => ({
    meta: [{ title: `${nav_main_career()} | ${SITE_CONFIG.title}` }],
    links: buildCanonicalLink(`${SITE_CONFIG.url}/career`),
  }),
  component: MobileCareer,
});

function MobileCareer() {
  return <CareerTimeline />;
}
