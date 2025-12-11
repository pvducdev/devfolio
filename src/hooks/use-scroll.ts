import { useMotionValueEvent, useScroll } from "motion/react";
import { type RefObject, useState } from "react";

type ScrollOptions = {
  container?: RefObject<HTMLElement | null>;
  threshold?: number;
};

export type ScrollState = {
  isAtTop: boolean;
  isAtBottom: boolean;
};

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
