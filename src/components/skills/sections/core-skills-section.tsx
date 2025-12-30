import type { Skills } from "@/config/skills";
import CoreSkillItem from "../components/core-skill-item";
import SectionHeader from "../components/section-header";

interface CoreSkillsSectionProps {
  skills: Skills["core"];
}

export default function CoreSkillsSection({ skills }: CoreSkillsSectionProps) {
  return (
    <section className="group/section col-span-1 flex flex-col gap-2 md:col-span-12 lg:col-span-10">
      <SectionHeader className="mb-3 max-w-45" number="01" title="The Core" />
      {skills.map((skill, index) => (
        <CoreSkillItem
          alternates={"alternates" in skill ? skill.alternates : undefined}
          details={skill.details}
          index={index}
          key={skill.name}
          name={skill.name}
          tag={skill.tag}
        />
      ))}
    </section>
  );
}
