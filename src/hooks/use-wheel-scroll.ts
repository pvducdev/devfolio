import type { MotionValue } from "motion/react";
import { useState } from "react";
import { useDebounceCallback, useEventListener } from "usehooks-ts";

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

  const stopScrolling = useDebounceCallback(() => {
    setIsScrolling(false);
  }, scrollStopDelay);

  useEventListener(
    "wheel",
    (e: WheelEvent) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) {
        return;
      }

      container.scrollLeft += e.deltaY;
      scrollX.set(container.scrollLeft);
      setIsScrolling(true);
      stopScrolling();
    },
    containerRef,
    { passive: false }
  );

  return { isScrolling };
}
