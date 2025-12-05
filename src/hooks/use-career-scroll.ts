import type { Easing } from "motion";
import type { AnimationPlaybackControls } from "motion/react";
import {
  animate,
  useMotionValueEvent,
  useScroll,
  useTransform,
  useVelocity,
} from "motion/react";
import { type RefObject, useEffectEvent, useRef } from "react";
import { useEventListener, useUnmount } from "usehooks-ts";
import { useShallow } from "zustand/react/shallow";
import { useCareerStore } from "@/store/career.ts";

type UseCareerScrollReturn = {
  containerRef: RefObject<HTMLDivElement | null>;
};

const LOOP_DURATION_S = 3;
const LOOP_DURATION_EASE: Easing = [0.33, 1, 0.68, 1];
const SCROLL_END_THRESHOLD_PX = 2;

export function useCareerScroll(velocityThreshold = 50): UseCareerScrollReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const { scrollX } = useScroll({ container: containerRef });
  const [status, setStatus, reset] = useCareerStore(
    useShallow((s) => [s.status, s.setStatus, s.reset])
  );

  const scrollVelocity = useVelocity(scrollX);
  const isScrollingValue = useTransform(
    scrollVelocity,
    (v) => Math.abs(v) > velocityThreshold
  );

  const triggerLoop = useEffectEvent(() => {
    const container = containerRef.current;
    if (!container || status === "looping") {
      return;
    }

    setStatus("looping");

    animationRef.current = animate(container.scrollLeft, 0, {
      duration: LOOP_DURATION_S,
      ease: LOOP_DURATION_EASE,
      onUpdate: (value) => {
        container.scrollLeft = value;
      },
      onComplete: () => {
        reset();
        animationRef.current = null;
      },
    });
  });

  const handleWheel = useEffectEvent((e: WheelEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container || status === "looping") {
      return;
    }

    const maxScroll = container.scrollWidth - container.clientWidth;
    const isAtEnd = maxScroll - container.scrollLeft < SCROLL_END_THRESHOLD_PX;

    if (isAtEnd && e.deltaY > 0) {
      triggerLoop();
      return;
    }

    container.scrollLeft += e.deltaY;
  });

  useMotionValueEvent(isScrollingValue, "change", (scrolling) => {
    if (status !== "looping") {
      setStatus(scrolling ? "scrolling" : "idle");
    }
  });
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

  return {
    containerRef,
  };
}
