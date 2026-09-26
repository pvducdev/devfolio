import type { MotionValue } from "motion/react";
import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { CAREER_TIMELINE } from "@/config/career";

import { useCareerActions } from "../store";
import { useScrollStatus } from "../use-scroll-status";

const SCROLL_CONFIG = {
  ioThreshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
  minActivateRatio: 0.2,
} as const;

interface UseCareerTimelineOptions {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  scrollY: MotionValue<number>;
}

interface UseCareerTimelineReturn {
  sectionRefs: RefObject<HTMLDivElement | null>[];
}

const findMostVisibleSection = (
  refs: RefObject<HTMLDivElement | null>[],
  ratios: Map<Element, number>
): number => {
  let bestIndex = -1;
  let bestRatio = 0;

  for (let i = 0; i < refs.length; i += 1) {
    const el = refs[i].current;
    if (!el) {
      continue;
    }
    const ratio = ratios.get(el) ?? 0;
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestIndex = i;
    }
  }

  return bestRatio > SCROLL_CONFIG.minActivateRatio ? bestIndex : -1;
};

export const useCareerTimeline = ({
  scrollContainerRef,
  scrollY,
}: UseCareerTimelineOptions): UseCareerTimelineReturn => {
  const { setActiveYear, reset } = useCareerActions();
  const ratioMap = useRef(new Map<Element, number>());

  const sectionRefs = useRef<RefObject<HTMLDivElement | null>[]>(
    CAREER_TIMELINE.map(() => ({ current: null }))
  ).current;

  useScrollStatus(scrollY);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratioMap.current.set(entry.target, entry.intersectionRatio);
        }

        const best = findMostVisibleSection(sectionRefs, ratioMap.current);
        if (best !== -1) {
          setActiveYear(CAREER_TIMELINE[best].year);
        }
      },
      { root: container, threshold: [...SCROLL_CONFIG.ioThreshold] }
    );

    for (const ref of sectionRefs) {
      if (ref.current) {
        observer.observe(ref.current);
      }
    }

    return () => {
      observer.disconnect();
      reset();
    };
  }, [scrollContainerRef, sectionRefs, setActiveYear, reset]);

  return { sectionRefs };
};
