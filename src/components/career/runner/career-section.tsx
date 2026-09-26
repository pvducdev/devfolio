import { cn } from "cn";
import { useIntersectionObserver } from "usehooks-ts";

import type { CareerEntry } from "@/config/career";

import { UI_CONFIG } from "../config";
import { useActiveYear, useCareerActions, useCareerLooping } from "../store";
import JobCard from "./job-card";
import Landmark from "./landmark";
import { useCareerScrollContainer } from "./scroll-context";

interface CareerSectionProps {
  entry: CareerEntry;
}

export default function CareerSection({ entry }: CareerSectionProps) {
  const containerRef = useCareerScrollContainer();
  const activeYear = useActiveYear();
  const { setActiveYear } = useCareerActions();
  const careerLooping = useCareerLooping();

  const isActive = activeYear === entry.year;

  const { ref } = useIntersectionObserver({
    onChange: (isIntersecting) => {
      if (careerLooping) {
        return;
      }
      if (isIntersecting) {
        setActiveYear(entry.year);
      } else if (isActive) {
        setActiveYear(null);
      }
    },
    root: containerRef.current,
    rootMargin: UI_CONFIG.sectionMargin,
  });

  return (
    <div className="relative flex shrink-0 items-end" ref={ref}>
      <div className="absolute top-15 bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center">
        <JobCard
          details={entry.details}
          expanded={entry.expanded}
          isActive={isActive}
          jobType={entry.jobType}
          subtitle={entry.company}
          title={entry.title}
        />
        <div
          className={cn(
            "w-px flex-1 bg-border transition-opacity duration-300",
            isActive ? "opacity-100" : "opacity-30"
          )}
        />
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <Landmark icon={entry.icon} />
      </div>
    </div>
  );
}
