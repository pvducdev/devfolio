import { createFileRoute } from "@tanstack/react-router";
import Activity from "@/components/about/mobile/activity.tsx";
import Bio from "@/components/about/mobile/bio.tsx";
import Links from "@/components/about/mobile/links.tsx";
import Profile from "@/components/about/mobile/profile.tsx";
import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { nav_main_about } from "@/paraglide/messages";

export const Route = createFileRoute("/m/about")({
  head: () => ({
    meta: [{ title: `${nav_main_about()} | ${SITE_CONFIG.title}` }],
    links: buildCanonicalLink(`${SITE_CONFIG.url}/about`),
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="py-6">
      <Profile />
      <Bio />
      <Links />
      <Activity />
    </div>
  );
}
