import { createFileRoute } from "@tanstack/react-router";
import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { nav_main_about } from "@/paraglide/messages";

export const Route = createFileRoute("/m/about")({
  head: () => ({
    meta: [{ title: `${nav_main_about()} | ${SITE_CONFIG.title}` }],
    links: buildCanonicalLink(`${SITE_CONFIG.url}/about`),
  }),
  component: MobileAbout,
});

function MobileAbout() {
  return (
    <div className="py-6">
      <div className="mt-4 text-muted-foreground text-sm">
        <p>{">"} about.txt — coming soon</p>
      </div>
    </div>
  );
}
