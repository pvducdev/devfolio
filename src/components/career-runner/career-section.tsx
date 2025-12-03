import type { CareerSection } from "@/config/career-timeline";
import { JobCard } from "./job-card";
import { Landmark } from "./landmark";
import { Section } from "./section";

type CareerSectionContentProps = {
  section: CareerSection;
  isActive: boolean;
  isCurrent: boolean;
};

export function CareerSectionContent({
  section,
  isActive,
  isCurrent,
}: CareerSectionContentProps) {
  return (
    <Section>
      <div className="-translate-x-1/2 absolute top-15 left-1/2">
        <JobCard
          details={section.card.details}
          isActive={isActive}
          isCurrent={isCurrent}
          jobType={section.jobType}
          style={section.card.style}
          subtitle={section.card.subtitle}
          title={section.card.title}
        />
      </div>

      <div className="-translate-x-1/2 absolute top-56 bottom-10 left-1/2 w-px bg-foreground/20" />

      <div className="-translate-x-1/2 absolute bottom-3 left-1/2">
        <Landmark type={section.landmark} />
      </div>
    </Section>
  );
}
