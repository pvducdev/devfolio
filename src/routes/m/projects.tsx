import { createFileRoute } from "@tanstack/react-router";
import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { nav_main_projects } from "@/paraglide/messages";

export const Route = createFileRoute("/m/projects")({
  head: () => ({
    meta: [{ title: `${nav_main_projects()} | ${SITE_CONFIG.title}` }],
    links: buildCanonicalLink(`${SITE_CONFIG.url}/projects`),
  }),
  component: MobileProjects,
});

function MobileProjects() {
  return (
    <div className="py-6">
      <div className="mt-4 text-muted-foreground text-sm">
        <p>{">"} ls projects — coming soon</p>
      </div>
    </div>
  );
}
