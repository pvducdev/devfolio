import { createFileRoute } from "@tanstack/react-router";

import CareerTimeline from "@/components/career/mobile/career-timeline";
import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { nav_main_career } from "@/paraglide/messages";

const MobileCareer = () => <CareerTimeline />;

export const Route = createFileRoute("/m/career")({
  component: MobileCareer,
  head: () => ({
    links: buildCanonicalLink(`${SITE_CONFIG.url}/career`),
    meta: [{ title: `${nav_main_career()} | ${SITE_CONFIG.title}` }],
  }),
});
