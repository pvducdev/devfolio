import { useCallback, useEffect, useRef, useState } from "react";

type ActiveZoneOptions = {
  /** Defines the center zone as a percentage (0.5 = center 50%) */
  zoneWidth?: number;
  /** Callback when entering the zone */
  onEnter?: () => void;
  /** Callback when exiting the zone */
  onExit?: () => void;
  /** Root element (defaults to viewport) */
  root?: Element | null;
};

type ActiveZoneState = {
  isInZone: boolean;
  intersectionRatio: number;
};

export function useActiveZone<T extends Element>(
  options: ActiveZoneOptions = {}
) {
  const { zoneWidth = 0.5, onEnter, onExit, root = null } = options;
  const ref = useRef<T>(null);
  const [state, setState] = useState<ActiveZoneState>({
    isInZone: false,
    intersectionRatio: 0,
  });
  const wasInZone = useRef(false);

  // Calculate rootMargin to create center zone
  // For 50% center zone: left 25%, right 25% margins (negative to shrink)
  const sideMargin = ((1 - zoneWidth) / 2) * 100;
  const rootMargin = `0px -${sideMargin}% 0px -${sideMargin}%`;

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      const isInZone = entry.isIntersecting;
      const intersectionRatio = entry.intersectionRatio;

      setState({ isInZone, intersectionRatio });

      // Fire callbacks on transitions
      if (isInZone && !wasInZone.current) {
        onEnter?.();
        wasInZone.current = true;
      } else if (!isInZone && wasInZone.current) {
        onExit?.();
        wasInZone.current = false;
      }
    },
    [onEnter, onExit]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      root,
      rootMargin,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection, root, rootMargin]);

  return { ref, ...state };
}
