import { createFileRoute } from "@tanstack/react-router";
import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { ui_search_group_skills } from "@/paraglide/messages";

export const Route = createFileRoute("/m/skills")({
  head: () => ({
    meta: [{ title: `${ui_search_group_skills()} | ${SITE_CONFIG.title}` }],
    links: buildCanonicalLink(`${SITE_CONFIG.url}/skills`),
  }),
  component: MobileSkills,
});

function MobileSkills() {
  return (
    <div className="py-6">
      <div className="mt-4 text-muted-foreground text-sm">
        <p>{">"} skills_check.sh — coming soon</p>
      </div>
    </div>
  );
}
