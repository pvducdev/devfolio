import type { MotionValue } from "motion/react";
import { useMotionValueEvent } from "motion/react";
import type { RefObject } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  CAREER_SECTIONS,
  type CareerSection,
  RUNNER_CONFIG,
} from "@/config/career-timeline";
import { useMilestoneStore } from "@/store/milestone";
import {
  calculateSectionIndex,
  normalizeScrollPosition,
} from "../infinite-scroll-utils";

type UseMilestoneDetectionOptions = {
  alignmentTolerance: number;
  containerRef: RefObject<HTMLElement | null>;
};

type UseMilestoneDetectionReturn = {
  currentSection: CareerSection;
  activeSectionId: string | null;
};

const SPACER_WIDTH = RUNNER_CONFIG.spacerWidth;
const LANDMARK_OFFSET = RUNNER_CONFIG.sectionWidth / 2;

export function useMilestoneDetection(
  scrollX: MotionValue<number>,
  options: UseMilestoneDetectionOptions
): UseMilestoneDetectionReturn {
  const [currentSection, setCurrentSection] = useState<CareerSection>(
    CAREER_SECTIONS[0]
  );

  const activeSectionId = useMilestoneStore((s) => s.activeSectionId);
  const setActiveSection = useMilestoneStore((s) => s.setActiveSection);
  const setMilestoneZone = useMilestoneStore((s) => s.setMilestoneZone);
  const resetMilestone = useMilestoneStore((s) => s.reset);

  useEffect(() => () => resetMilestone(), [resetMilestone]);

  const calculateActiveSection = useCallback(
    (scrollLeft: number) => {
      const { normalizedScroll } = normalizeScrollPosition(scrollLeft);

      // Character is centered, so its position is half the container width
      const containerWidth =
        options.containerRef.current?.parentElement?.clientWidth ?? 800;
      const characterLeft = containerWidth / 2;

      for (let i = 0; i < CAREER_SECTIONS.length; i++) {
        const alignmentScrollPos =
          SPACER_WIDTH +
          i * RUNNER_CONFIG.sectionWidth +
          LANDMARK_OFFSET -
          characterLeft;

        if (
          Math.abs(normalizedScroll - alignmentScrollPos) <=
          options.alignmentTolerance
        ) {
          const section = CAREER_SECTIONS[i];
          if (section && activeSectionId !== section.id) {
            setActiveSection(section.id);
            setMilestoneZone(true);
          }
          return;
        }
      }

      if (activeSectionId !== null) {
        setMilestoneZone(false);
        setActiveSection(null);
      }
    },
    [
      activeSectionId,
      setActiveSection,
      setMilestoneZone,
      options.alignmentTolerance,
      options.containerRef,
    ]
  );

  useMotionValueEvent(scrollX, "change", (latest) => {
    const sectionIndex = calculateSectionIndex(latest);
    const section = CAREER_SECTIONS[sectionIndex];
    if (section && section.id !== currentSection.id) {
      setCurrentSection(section);
    }

    calculateActiveSection(latest);
  });

  return { currentSection, activeSectionId };
}
