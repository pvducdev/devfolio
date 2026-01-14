import { SKILLS } from "@/config/skills";
import ExploringSection from "./exploring-section.tsx";
import CoreSkillsSection from "./sections/core-skills-section";
import DevOpsSection from "./sections/devops-section";
import StackSection from "./sections/stack-section";
import StandardsSection from "./sections/standards-section";
import WorkflowSection from "./sections/workflow-section";
import SkillsHeader from "./skills-header";

export default function SkillsPage() {
  return (
    <div className="relative bg-background p-4 font-sans text-foreground selection:bg-foreground selection:text-background md:p-8 lg:p-12">
      <SkillsHeader />

      <main className="mx-auto mt-12 grid max-w-300 grid-cols-1 gap-x-7 gap-y-24 pb-24 md:mt-8 md:grid-cols-12">
        <CoreSkillsSection skills={SKILLS.core} />
        <StackSection items={SKILLS.stack} />
        <DevOpsSection items={SKILLS.devops} />
        <StandardsSection standards={SKILLS.standards} />
        <WorkflowSection items={SKILLS.workflow} />
        <ExploringSection items={SKILLS.exploring} />
      </main>
    </div>
  );
}
