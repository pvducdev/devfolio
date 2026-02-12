import { createFileRoute } from "@tanstack/react-router";
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
  return (
    <div className="py-6">
      <div className="mt-4 text-muted-foreground text-sm">
        <p>{">"} view_career.sh — coming soon</p>
      </div>
    </div>
  );
}
