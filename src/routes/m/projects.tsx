import { createFileRoute, Outlet } from "@tanstack/react-router";
import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { nav_main_projects } from "@/paraglide/messages";

export const Route = createFileRoute("/m/projects")({
  head: () => ({
    meta: [{ title: `${nav_main_projects()} | ${SITE_CONFIG.title}` }],
    links: buildCanonicalLink(`${SITE_CONFIG.url}/projects`),
  }),
  component: MobileProjectsLayout,
});

function MobileProjectsLayout() {
  return <Outlet />;
}
