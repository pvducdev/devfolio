import { createFileRoute } from "@tanstack/react-router";

import CoreHero from "@/components/skills/mobile/core-hero";
import DevopsCascade from "@/components/skills/mobile/devops-cascade";
import ExploringFooter from "@/components/skills/mobile/exploring-footer";
import StackList from "@/components/skills/mobile/stack-list";
import StandardsCards from "@/components/skills/mobile/standards-cards";
import WorkflowWrap from "@/components/skills/mobile/workflow-wrap";
import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { SKILLS } from "@/config/skills";
import { ui_search_group_skills } from "@/paraglide/messages";

const MobileSkills = () => (
  <div className="flex flex-col gap-14 py-6">
    <CoreHero skills={SKILLS.core} />
    <StackList items={SKILLS.stack} />
    <DevopsCascade items={SKILLS.devops} />
    <StandardsCards standards={SKILLS.standards} />
    <WorkflowWrap items={SKILLS.workflow} />
    <ExploringFooter items={SKILLS.exploring} />
  </div>
);

export const Route = createFileRoute("/m/skills")({
  component: MobileSkills,
  head: () => ({
    links: buildCanonicalLink(`${SITE_CONFIG.url}/skills`),
    meta: [{ title: `${ui_search_group_skills()} | ${SITE_CONFIG.title}` }],
  }),
});
