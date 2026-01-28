import { createFileRoute } from "@tanstack/react-router";
import SkillsPage from "@/components/skills";
import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { ui_search_group_skills } from "@/paraglide/messages";

export const Route = createFileRoute("/_root-layout/skills")({
  head: () => ({
    meta: [{ title: `${ui_search_group_skills()} | ${SITE_CONFIG.title}` }],
    links: buildCanonicalLink(`${SITE_CONFIG.url}/skills`),
  }),
  component: SkillsPage,
});
