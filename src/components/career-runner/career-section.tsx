import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import {
  type CareerSection as TCareerSection,
  UI_CONFIG,
} from "@/components/career-timeline/config";
import { useCareerScrollCtx } from "@/context/career-scroll.tsx";
import { cn } from "@/lib/utils";
import {
  useActiveSectionId,
  useCareerActions,
  useCareerLooping,
} from "@/store/career";
import JobCard from "./job-card";
import Landmark from "./landmark";

interface CareerSectionProps {
  section: TCareerSection;
}

export default function CareerSection({ section }: CareerSectionProps) {
  const { containerRef } = useCareerScrollCtx();
  const activeSectionId = useActiveSectionId();
  const { setActiveSection } = useCareerActions();
  const careerLooping = useCareerLooping();

  const isActive = activeSectionId === section.id;

  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: UI_CONFIG.sectionMargin,
    root: containerRef.current,
  });

  const prevIntersecting = useRef(isIntersecting);

  useEffect(() => {
    if (careerLooping) {
      return;
    }
    if (prevIntersecting.current === isIntersecting) {
      return;
    }
    prevIntersecting.current = isIntersecting;

    if (isIntersecting) {
      setActiveSection(section.id);
    } else if (activeSectionId === section.id) {
      setActiveSection(null);
    }
  }, [
    isIntersecting,
    section.id,
    activeSectionId,
    careerLooping,
    setActiveSection,
  ]);

  return (
    <div className="relative flex shrink-0 items-end" ref={ref}>
      <div className="absolute top-15 bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center">
        <JobCard
          details={section.card.details}
          expanded={section.card.expanded}
          isActive={isActive}
          subtitle={section.card.subtitle}
          title={section.card.title}
        />
        <div
          className={cn(
            "w-px flex-1 bg-border transition-opacity duration-300",
            isActive ? "opacity-100" : "opacity-30"
          )}
        />
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <Landmark icon={section.icon} />
      </div>
    </div>
  );
}
