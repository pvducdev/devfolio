import type { MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

type UseWheelScrollOptions = {
  scrollStopDelay?: number;
};

type UseWheelScrollReturn = {
  isScrolling: boolean;
};

export function useWheelScroll(
  containerRef: React.RefObject<HTMLDivElement | null>,
  scrollX: MotionValue<number>,
  options: UseWheelScrollOptions = {}
): UseWheelScrollReturn {
  const { scrollStopDelay = 150 } = options;

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
      scrollX.set(container.scrollLeft);

      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, scrollStopDelay);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [containerRef, scrollX, scrollStopDelay]);

  return { isScrolling };
}
