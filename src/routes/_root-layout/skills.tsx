import { createFileRoute } from "@tanstack/react-router";

import SkillsPage from "@/components/skills";
import { buildPageHead } from "@/config/seo";
import { ui_search_group_skills } from "@/paraglide/messages";

export const Route = createFileRoute("/_root-layout/skills")({
  component: SkillsPage,
  head: () => buildPageHead("/skills", ui_search_group_skills()),
});
