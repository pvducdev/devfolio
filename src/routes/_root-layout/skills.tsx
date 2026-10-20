import { createFileRoute } from "@tanstack/react-router";

import { buildPageHead } from "@/components/seo/head";
import SkillsPage from "@/components/skills";
import { ui_search_group_skills } from "@/paraglide/messages";

export const Route = createFileRoute("/_root-layout/skills")({
  component: SkillsPage,
  head: () => buildPageHead("/skills", ui_search_group_skills()),
});
