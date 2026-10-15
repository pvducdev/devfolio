import type { Easing } from "motion";
import type { AnimationPlaybackControls } from "motion/react";
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
} from "motion/react";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { useEventListener, useUnmount } from "usehooks-ts";

import { useCareerActions, useCareerLooping } from "../store";
import { useScrollStatus } from "../use-scroll-status";

interface UseCareerScrollReturn {
  containerRef: RefObject<HTMLDivElement | null>;
}

const SCROLL_CONFIG = {
  loopDuration: 3,
  loopEase: [0.33, 1, 0.68, 1] as Easing,
  scrollEndThreshold: 2,
  spring: { damping: 20, restDelta: 0.5, stiffness: 120 },
} as const;

export const useCareerScroll = (): UseCareerScrollReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const { setStatus, reset } = useCareerActions();
  const isLooping = useCareerLooping();

  const targetScrollX = useMotionValue(0);
  const smoothScrollX = useSpring(targetScrollX, SCROLL_CONFIG.spring);
  const { clearPendingIdle } = useScrollStatus(smoothScrollX);

  useMotionValueEvent(smoothScrollX, "change", (value) => {
    if (isLooping) {
      return;
    }
    const container = containerRef.current;
    if (container) {
      container.scrollLeft = value;
    }
  });

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container || isLooping) {
      return;
    }

    const maxScroll = container.scrollWidth - container.clientWidth;
    const currentTarget = targetScrollX.get();
    const isAtEnd =
      maxScroll - currentTarget < SCROLL_CONFIG.scrollEndThreshold;

    if (isAtEnd && e.deltaY > 0) {
      clearPendingIdle();
      setStatus("looping");
      animationRef.current = animate(container.scrollLeft, 0, {
        duration: SCROLL_CONFIG.loopDuration,
        ease: SCROLL_CONFIG.loopEase,
        onComplete: () => {
          reset();
          animationRef.current = null;
        },
        onUpdate: (value) => {
          container.scrollLeft = value;
          targetScrollX.jump(value);
          smoothScrollX.jump(value);
        },
      });
      return;
    }

    const clampedPosition = Math.max(
      0,
      Math.min(maxScroll, currentTarget + e.deltaY)
    );
    targetScrollX.set(clampedPosition);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      targetScrollX.jump(container.scrollLeft);
      smoothScrollX.jump(container.scrollLeft);
    }
  }, [targetScrollX, smoothScrollX]);

  useEventListener(
    "wheel",
    handleWheel,
    containerRef as RefObject<HTMLDivElement>,
    { passive: false }
  );

  useUnmount(() => {
    animationRef.current?.stop();
    reset();
  });

  return { containerRef };
};
