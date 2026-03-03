import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { CAREER_SECTIONS } from "@/components/career-runner/config";
import { useCareerActions } from "@/store/career";

const IO_THRESHOLD = 0.4;
const IDLE_DEBOUNCE_MS = 150;

interface UseCareerTimelineReturn {
  sectionRefs: RefObject<HTMLDivElement | null>[];
  activeIndex: number;
}

export function useCareerTimeline(
  scrollContainerRef: RefObject<HTMLDivElement | null>
): UseCareerTimelineReturn {
  const [activeIndex, setActiveIndex] = useState(-1);
  const { setActiveSection, setStatus, reset } = useCareerActions();
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sectionRefs = useRef<RefObject<HTMLDivElement | null>[]>(
    CAREER_SECTIONS.map(() => ({ current: null }))
  ).current;

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = sectionRefs.findIndex(
              (ref) => ref.current === entry.target
            );
            if (index !== -1) {
              setActiveIndex(index);
              setActiveSection(CAREER_SECTIONS[index].id);
            }
          }
        }
      },
      { root: container, threshold: IO_THRESHOLD }
    );

    for (const ref of sectionRefs) {
      if (ref.current) {
        observer.observe(ref.current);
      }
    }

    const handleScroll = () => {
      setStatus("scrolling");

      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }

      idleTimeoutRef.current = setTimeout(() => {
        setStatus("idle");
        idleTimeoutRef.current = null;
      }, IDLE_DEBOUNCE_MS);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", handleScroll);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      reset();
    };
  }, [scrollContainerRef, sectionRefs, setActiveSection, setStatus, reset]);

  return { sectionRefs, activeIndex };
}
