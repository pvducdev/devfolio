import { useMotionValueEvent, useScroll } from "motion/react";
import { type RefObject, useState } from "react";
import { useEventListener } from "usehooks-ts";

interface ScrollOptions {
  container?: RefObject<HTMLElement | null>;
  threshold?: number;
}

export interface ScrollState {
  isAtTop: boolean;
  isAtBottom: boolean;
}

export function useScrollY(options: ScrollOptions = {}): ScrollState {
  const { container, threshold = 0.05 } = options;
  const [state, setState] = useState<ScrollState>({
    isAtTop: true,
    isAtBottom: true,
  });

  const { scrollYProgress } = useScroll({ container });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setState({
      isAtTop: progress < threshold,
      isAtBottom: progress > 1 - threshold,
    });
  });

  return state;
}

export function useHorizontalScroll(ref: RefObject<HTMLElement | null>) {
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
