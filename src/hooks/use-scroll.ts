import {
  type RefObject,
  useEffectEvent,
  useLayoutEffect,
  useState,
} from "react";

type ScrollTarget =
  | (() => HTMLElement | null | undefined)
  | RefObject<HTMLElement | null>;

type ScrollOptions = {
  target?: ScrollTarget;
  threshold?: number;
  behavior?: ScrollBehavior;
};

function resolveTarget(target?: ScrollTarget): HTMLElement | null {
  if (!target) {
    return null;
  }
  if (typeof target === "function") {
    return target() ?? null;
  }
  return target.current;
}

function isNearEdge(position: number, max: number, threshold: number): boolean {
  return position >= max - threshold;
}

function isNearStart(position: number, threshold: number): boolean {
  return position <= threshold;
}

export type ScrollYState = {
  y: number;
  isAtTop: boolean;
  isAtBottom: boolean;
};

export type UseScrollYOptions = ScrollOptions & {
  defaultY?: number;
};

export function useScrollY(
  options: UseScrollYOptions = {}
): [ScrollYState, (y: number) => void] {
  const { target, threshold = 50, defaultY = 0, behavior } = options;

  const [state, setState] = useState<ScrollYState>({
    y: defaultY,
    isAtTop: true,
    isAtBottom: true,
  });

  const scrollToY = useEffectEvent((y: number) => {
    const element = resolveTarget(target);
    const scrollTarget = element ?? window;
    scrollTarget.scrollTo({ top: y, behavior });
  });

  useLayoutEffect(() => {
    const element = resolveTarget(target);

    const updateState = () => {
      if (element) {
        const { scrollTop, scrollHeight, clientHeight } = element;
        const maxScroll = scrollHeight - clientHeight;

        setState({
          y: scrollTop,
          isAtTop: isNearStart(scrollTop, threshold),
          isAtBottom: isNearEdge(scrollTop, maxScroll, threshold),
        });
      } else {
        const { scrollY } = window;
        const { scrollHeight, clientHeight } = document.documentElement;
        const maxScroll = scrollHeight - clientHeight;

        setState({
          y: scrollY,
          isAtTop: isNearStart(scrollY, threshold),
          isAtBottom: isNearEdge(scrollY, maxScroll, threshold),
        });
      }
    };

    updateState();

    const scrollTarget = element ?? window;
    scrollTarget.addEventListener("scroll", updateState);
    return () => scrollTarget.removeEventListener("scroll", updateState);
  }, [target, threshold]);

  return [state, scrollToY];
}

export type ScrollXState = {
  x: number;
  isAtLeft: boolean;
  isAtRight: boolean;
};

export type UseScrollXOptions = ScrollOptions & {
  defaultX?: number;
};

export function useScrollX(
  options: UseScrollXOptions = {}
): [ScrollXState, (x: number) => void] {
  const { target, threshold = 50, defaultX = 0, behavior } = options;

  const [state, setState] = useState<ScrollXState>({
    x: defaultX,
    isAtLeft: true,
    isAtRight: true,
  });

  const scrollToX = useEffectEvent((x: number) => {
    const element = resolveTarget(target);
    const scrollTarget = element ?? window;

    scrollTarget.scrollTo({ left: x, behavior });
  });

  useLayoutEffect(() => {
    const element = resolveTarget(target);

    const updateState = () => {
      if (element) {
        const { scrollLeft, scrollWidth, clientWidth } = element;
        const maxScroll = scrollWidth - clientWidth;

        setState({
          x: scrollLeft,
          isAtLeft: isNearStart(scrollLeft, threshold),
          isAtRight: isNearEdge(scrollLeft, maxScroll, threshold),
        });
      } else {
        const { scrollX } = window;
        const { scrollWidth, clientWidth } = document.documentElement;
        const maxScroll = scrollWidth - clientWidth;

        setState({
          x: scrollX,
          isAtLeft: isNearStart(scrollX, threshold),
          isAtRight: isNearEdge(scrollX, maxScroll, threshold),
        });
      }
    };

    updateState();

    const scrollTarget = element ?? window;
    scrollTarget.addEventListener("scroll", updateState);
    return () => scrollTarget.removeEventListener("scroll", updateState);
  }, [target, threshold]);

  return [state, scrollToX];
}
