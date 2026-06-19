import { createFileRoute, Outlet } from "@tanstack/react-router";

import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { nav_main_projects } from "@/paraglide/messages";

const MobileProjectsLayout = () => <Outlet />;

export const Route = createFileRoute("/m/projects")({
  component: MobileProjectsLayout,
  head: () => ({
    links: buildCanonicalLink(`${SITE_CONFIG.url}/projects`),
    meta: [{ title: `${nav_main_projects()} | ${SITE_CONFIG.title}` }],
  }),
});
