import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  useVelocity,
} from "motion/react";
import { type RefObject, useRef, useState } from "react";
import { useEventListener, useUnmount } from "usehooks-ts";
import { useShallow } from "zustand/react/shallow";
import { useCareerStore } from "@/store/career.ts";

type UseCareerScrollReturn = {
  containerRef: RefObject<HTMLDivElement>;
  isScrolling: boolean;
};

export function useCareerScroll(velocityThreshold = 50): UseCareerScrollReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const { scrollX } = useScroll({ container: containerRef });
  const resetMilestone = useCareerStore(useShallow((s) => s.reset));

  const scrollVelocity = useVelocity(scrollX);
  const isScrollingValue = useTransform(
    scrollVelocity,
    (v) => Math.abs(v) > velocityThreshold
  );

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const container = containerRef.current as HTMLDivElement;

    container.scrollLeft += e.deltaY;
  };

  useMotionValueEvent(isScrollingValue, "change", setIsScrolling);
  useEventListener(
    "wheel",
    handleWheel,
    containerRef as RefObject<HTMLDivElement>,
    { passive: false }
  );
  useUnmount(resetMilestone);

  return {
    containerRef: containerRef as RefObject<HTMLDivElement>,
    isScrolling,
  };
}
