import { useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import type { CareerSection as TCareerSection } from "@/config/career-timeline";
import { UI_CONFIG } from "@/config/career-timeline.ts";
import { useCareerStore } from "@/store/career.ts";
import { JobCard } from "./job-card";
import { Landmark } from "./landmark";

type CareerSectionProps = {
  section: TCareerSection;
};

export function CareerSection({ section }: CareerSectionProps) {
  const { activeSection, setActiveSection, reset } = useCareerStore();
  const isActive = activeSection?.id === section.id;

  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: UI_CONFIG.sectionMargin,
    threshold: 0.5,
  });

  useEffect(() => {
    if (isIntersecting) {
      setActiveSection(section);
    } else {
      reset();
    }
  }, [isIntersecting, section, setActiveSection, reset]);

  return (
    <div className="relative flex shrink-0 items-end pb-8">
      <div className="-translate-x-1/2 absolute top-15 left-1/2">
        <JobCard
          details={section.card.details}
          expanded={section.card.expanded}
          isActive={isActive}
          subtitle={section.card.subtitle}
          title={section.card.title}
        />
      </div>

      <div className="-translate-x-1/2 absolute top-56 bottom-10 left-1/2 w-px bg-foreground/20" />

      <div className="-translate-x-1/2 absolute bottom-1 left-1/2" ref={ref}>
        <Landmark icon={section.icon} />
      </div>
    </div>
  );
}
