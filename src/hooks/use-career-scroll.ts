import {
  type MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  useVelocity,
} from "motion/react";
import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useEventListener, useUnmount } from "usehooks-ts";
import {
  CAREER_SECTIONS,
  type CareerSection,
  RUNNER_CONFIG,
} from "@/config/career-timeline";
import {
  calculateSectionIndex,
  getRealContentStartPos,
  normalizeScrollPosition,
} from "@/lib/infinite-scroll-utils";
import { useMilestoneStore } from "@/store/milestone";

type UseCareerScrollOptions = {
  teleportDebounceMs: number;
  alignmentTolerance: number;
  velocityThreshold?: number;
};

type UseCareerScrollReturn = {
  containerRef: RefObject<HTMLDivElement>;
  scrollX: MotionValue<number>;
  isScrolling: boolean;
  currentSection: CareerSection;
  activeSectionId: string | null;
};

const SPACER_WIDTH = RUNNER_CONFIG.spacerWidth;
const LANDMARK_OFFSET = RUNNER_CONFIG.sectionWidth / 2;

export function useCareerScroll(
  options: UseCareerScrollOptions
): UseCareerScrollReturn {
  const {
    teleportDebounceMs,
    alignmentTolerance,
    velocityThreshold = 50,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollX = useMotionValue(0);
  const teleportLockRef = useRef(false);
  const lastTeleportTimeRef = useRef(0);

  // Derive velocity from scrollX
  const scrollVelocity = useVelocity(scrollX);

  // Derive isScrolling from velocity
  const isScrollingValue = useTransform(
    scrollVelocity,
    (v) => Math.abs(v) > velocityThreshold
  );

  // Track isScrolling as React state for Character component
  const [isScrolling, setIsScrolling] = useState(false);
  useMotionValueEvent(isScrollingValue, "change", setIsScrolling);

  // Derive normalized scroll for milestone detection
  const normalizedScroll = useTransform(scrollX, (x) => {
    const { normalizedScroll: normalized } = normalizeScrollPosition(x);
    return normalized;
  });

  // Derive section index from scroll position
  const sectionIndex = useTransform(scrollX, calculateSectionIndex);

  // Track current section as React state
  const [currentSection, setCurrentSection] = useState<CareerSection>(
    CAREER_SECTIONS[0]
  );

  useMotionValueEvent(sectionIndex, "change", (idx) => {
    const section = CAREER_SECTIONS[idx];
    if (section && section.id !== currentSection.id) {
      setCurrentSection(section);
    }
  });

  // Zustand store actions
  const setActiveSection = useMilestoneStore((s) => s.setActiveSection);
  const setMilestoneZone = useMilestoneStore((s) => s.setMilestoneZone);
  const resetMilestone = useMilestoneStore((s) => s.reset);

  // Track activeSectionId from store
  const activeSectionId = useMilestoneStore((s) => s.activeSectionId);

  // Track previous active section to prevent redundant updates
  const prevActiveSectionRef = useRef<string | null>(null);

  // Milestone detection using derived normalized scroll
  useMotionValueEvent(normalizedScroll, "change", (normalizedPos) => {
    const containerWidth =
      containerRef.current?.parentElement?.clientWidth ?? 800;
    const characterLeft = containerWidth / 2;

    let foundSection: string | null = null;

    for (let i = 0; i < CAREER_SECTIONS.length; i++) {
      const alignmentScrollPos =
        SPACER_WIDTH +
        i * RUNNER_CONFIG.sectionWidth +
        LANDMARK_OFFSET -
        characterLeft;

      if (Math.abs(normalizedPos - alignmentScrollPos) <= alignmentTolerance) {
        foundSection = CAREER_SECTIONS[i]?.id ?? null;
        break;
      }
    }

    // Only update store if changed
    if (foundSection !== prevActiveSectionRef.current) {
      prevActiveSectionRef.current = foundSection;
      setActiveSection(foundSection);
      setMilestoneZone(foundSection !== null);
    }
  });

  useUnmount(resetMilestone);

  // Initialize scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const startPos = getRealContentStartPos();
    container.scrollLeft = startPos;
    scrollX.set(startPos);
  }, [scrollX]);

  // Teleport handler for infinite scroll
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || teleportLockRef.current) {
      return;
    }

    const now = Date.now();
    if (now - lastTeleportTimeRef.current < teleportDebounceMs) {
      return;
    }

    const { needsTeleport, teleportTo } = normalizeScrollPosition(
      container.scrollLeft
    );

    if (needsTeleport && teleportTo !== null) {
      teleportLockRef.current = true;
      lastTeleportTimeRef.current = now;

      requestAnimationFrame(() => {
        container.scrollLeft = teleportTo;
        scrollX.set(teleportTo);

        requestAnimationFrame(() => {
          teleportLockRef.current = false;
        });
      });
    }
  }, [teleportDebounceMs, scrollX]);

  // Wheel-to-horizontal scroll handler
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) {
        return;
      }

      container.scrollLeft += e.deltaY;
      scrollX.set(container.scrollLeft);
    },
    [scrollX]
  );

  useEventListener("scroll", handleScroll, containerRef);
  useEventListener("wheel", handleWheel, containerRef, { passive: false });

  return {
    containerRef: containerRef as RefObject<HTMLDivElement>,
    scrollX,
    isScrolling,
    currentSection,
    activeSectionId,
  };
}
