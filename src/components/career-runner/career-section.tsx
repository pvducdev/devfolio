import { type RefObject, useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import {
  type CareerSection as TCareerSection,
  UI_CONFIG,
} from "@/config/career-timeline";
import {
  useActiveSectionId,
  useCareerActions,
  useCareerLooping,
} from "@/store/career";
import JobCard from "./job-card";
import Landmark from "./landmark";

type CareerSectionProps = {
  section: TCareerSection;
  containerRef: RefObject<HTMLDivElement | null>;
};

export default function CareerSection({
  section,
  containerRef,
}: CareerSectionProps) {
  const activeSectionId = useActiveSectionId();
  const { setActiveSection } = useCareerActions();
  const careerLooping = useCareerLooping();

  const isActive = activeSectionId === section.id;

  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: UI_CONFIG.sectionMargin,
    root: containerRef.current,
  });

  useEffect(() => {
    if (careerLooping) {
      return;
    }

    if (isIntersecting) {
      setActiveSection(section.id);
    } else if (activeSectionId === section.id) {
      setActiveSection(null);
    }
  }, [
    isIntersecting,
    section.id,
    setActiveSection,
    activeSectionId,
    careerLooping,
  ]);

  return (
    <div className="relative flex shrink-0 items-end" ref={ref}>
      <div className="-translate-x-1/2 absolute top-15 left-1/2">
        <JobCard
          details={section.card.details}
          expanded={section.card.expanded}
          isActive={isActive}
          subtitle={section.card.subtitle}
          title={section.card.title}
        />
      </div>

      {/*<div className="-translate-x-1/2 absolute top-56 bottom-10 left-1/2 w-px bg-foreground/20" />*/}

      <div className="-translate-x-1/2 absolute bottom-2 left-1/2">
        <Landmark icon={section.icon} />
      </div>
    </div>
  );
}
