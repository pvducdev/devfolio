import { useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import {
  getRealContentStartPos,
  normalizeScrollPosition,
} from "../infinite-scroll-utils";

type UseInfiniteScrollOptions = {
  teleportDebounceMs: number;
};

type UseInfiniteScrollReturn = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  scrollX: ReturnType<typeof useMotionValue<number>>;
};

export function useInfiniteScroll(
  options: UseInfiniteScrollOptions
): UseInfiniteScrollReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollX = useMotionValue(0);
  const teleportLockRef = useRef(false);
  const lastTeleportTimeRef = useRef(0);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || teleportLockRef.current) {
      return;
    }

    const now = Date.now();
    if (now - lastTeleportTimeRef.current < options.teleportDebounceMs) {
      return;
    }

    const { needsTeleport, teleportTo } = normalizeScrollPosition(
      container.scrollLeft
    );

    if (needsTeleport && teleportTo !== null) {
      teleportLockRef.current = true;
      lastTeleportTimeRef.current = now;

      requestAnimationFrame(() => {
        container.scrollLeft = teleportTo;
        scrollX.set(teleportTo);

        requestAnimationFrame(() => {
          teleportLockRef.current = false;
        });
      });
    }
  }, [options.teleportDebounceMs, scrollX]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const startPos = getRealContentStartPos();
    container.scrollLeft = startPos;
    scrollX.set(startPos);
  }, [scrollX]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return { containerRef, scrollX };
}
