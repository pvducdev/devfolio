import type { MotionValue } from "motion/react";
import { useMotionValueEvent, useTransform, useVelocity } from "motion/react";
import { useRef } from "react";
import { useUnmount } from "usehooks-ts";

import { useCareerActions, useCareerLooping } from "./store";

const VELOCITY_THRESHOLD = 50;
const IDLE_DEBOUNCE_MS = 150;

export const useScrollStatus = (position: MotionValue<number>) => {
  const { setStatus } = useCareerActions();
  const isLooping = useCareerLooping();
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isScrolling = useTransform(
    useVelocity(position),
    (velocity) => Math.abs(velocity) > VELOCITY_THRESHOLD
  );

  const clearPendingIdle = () => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
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

    idleTimeoutRef.current = setTimeout(() => {
      setStatus("idle");
      idleTimeoutRef.current = null;
    }, IDLE_DEBOUNCE_MS);
  });

  useUnmount(clearPendingIdle);

  return { clearPendingIdle };
};
