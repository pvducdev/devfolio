import type { MotionValue } from "motion/react";
import { useMotionValueEvent, useTransform, useVelocity } from "motion/react";
import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";

import { CAREER_SECTIONS } from "@/components/career-runner/config";
import { useCareerActions } from "@/store/career";

const SCROLL_CONFIG = {
  idleDebounceMs: 150,
  ioThreshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
  minActivateRatio: 0.2,
  velocityThreshold: 50,
} as const;

interface UseCareerTimelineOptions {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  scrollY: MotionValue<number>;
}

interface UseCareerTimelineReturn {
  sectionRefs: RefObject<HTMLDivElement | null>[];
  activeIndex: number;
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
  const [activeIndex, setActiveIndex] = useState(-1);
  const { setActiveSection, setStatus, reset } = useCareerActions();
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ratioMap = useRef(new Map<Element, number>());

  const sectionRefs = useRef<RefObject<HTMLDivElement | null>[]>(
    CAREER_SECTIONS.map(() => ({ current: null }))
  ).current;

  const scrollVelocity = useVelocity(scrollY);
  const isScrolling = useTransform(
    scrollVelocity,
    (v) => Math.abs(v) > SCROLL_CONFIG.velocityThreshold
  );

  useMotionValueEvent(isScrolling, "change", (scrolling) => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }

    if (scrolling) {
      setStatus("scrolling");
      return;
    }

    idleTimeoutRef.current = setTimeout(() => {
      setStatus("idle");
      idleTimeoutRef.current = null;
    }, SCROLL_CONFIG.idleDebounceMs);
  });

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
          setActiveIndex(best);
          setActiveSection(CAREER_SECTIONS[best].id);
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
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      reset();
    };
  }, [scrollContainerRef, sectionRefs, setActiveSection, reset]);

  return { activeIndex, sectionRefs };
};
