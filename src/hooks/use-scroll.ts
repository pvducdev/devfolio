import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import type { RefObject } from "react";
import { useEventListener } from "usehooks-ts";

interface ScrollOptions {
  container?: RefObject<HTMLElement | null>;
  threshold?: number;
}

export interface ScrollState {
  isAtTop: boolean;
  isAtBottom: boolean;
}

export function useScrollEdges(options: ScrollOptions = {}): ScrollState {
  const { container, threshold = 0.05 } = options;
  const [state, setState] = useState<ScrollState>({
    isAtBottom: true,
    isAtTop: true,
  });

  const { scrollYProgress } = useScroll({ container });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setState({
      isAtBottom: progress > 1 - threshold,
      isAtTop: progress < threshold,
    });
  });

  return state;
}

export function useWheelToHorizontal(ref: RefObject<HTMLElement | null>) {
  useEventListener(
    "wheel",
    (e) => {
      const element = ref.current;
      if (!element || e.deltaY === 0) {
        return;
      }

      const { scrollLeft, scrollWidth, clientWidth } = element;
      const maxScroll = scrollWidth - clientWidth;
      const atStart = scrollLeft <= 0;
      const atEnd = scrollLeft >= maxScroll;
      const scrollingDown = e.deltaY > 0;

      if ((atStart && !scrollingDown) || (atEnd && scrollingDown)) {
        return;
      }

      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      element.scrollLeft += delta;
    },
    ref as RefObject<HTMLElement>,
    { passive: false }
  );
}
