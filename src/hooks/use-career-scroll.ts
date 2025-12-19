import type { Easing } from "motion";
import type { AnimationPlaybackControls } from "motion/react";
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { type RefObject, useEffect, useRef } from "react";
import { useEventListener, useUnmount } from "usehooks-ts";
import { useCareerActions, useCareerLooping } from "@/store/career.ts";

type UseCareerScrollReturn = {
  containerRef: RefObject<HTMLDivElement | null>;
};

const SCROLL_CONFIG = {
  spring: { stiffness: 120, damping: 20, restDelta: 0.5 },
  velocityThreshold: 50,
  scrollEndThreshold: 2,
  loopDuration: 3,
  loopEase: [0.33, 1, 0.68, 1] as Easing,
  idleDebounceMs: 150,
} as const;

export function useCareerScroll(): UseCareerScrollReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setStatus, reset } = useCareerActions();
  const isLooping = useCareerLooping();

  const targetScrollX = useMotionValue(0);
  const smoothScrollX = useSpring(targetScrollX, SCROLL_CONFIG.spring);
  const scrollVelocity = useVelocity(smoothScrollX);
  const isScrolling = useTransform(
    scrollVelocity,
    (v) => Math.abs(v) > SCROLL_CONFIG.velocityThreshold
  );

  useMotionValueEvent(smoothScrollX, "change", (value) => {
    if (isLooping) {
      return;
    }
    const container = containerRef.current;
    if (container) {
      container.scrollLeft = value;
    }
  });

  const clearPendingIdle = () => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
  };

  const scheduleIdle = () => {
    idleTimeoutRef.current = setTimeout(() => {
      setStatus("idle");
      idleTimeoutRef.current = null;
    }, SCROLL_CONFIG.idleDebounceMs);
  };

  useMotionValueEvent(isScrolling, "change", (scrolling) => {
    if (isLooping) {
      return;
    }

    clearPendingIdle();

    if (scrolling) {
      setStatus("scrolling");
      return;
    }

    scheduleIdle();
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
        onUpdate: (value) => {
          container.scrollLeft = value;
          targetScrollX.jump(value);
          smoothScrollX.jump(value);
        },
        onComplete: () => {
          reset();
          animationRef.current = null;
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
    // biome-ignore lint/style/noNonNullAssertion: <no need>
    clearTimeout(idleTimeoutRef.current!);
    reset();
  });

  return { containerRef };
}
