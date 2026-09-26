import { createContext, use } from "react";
import type { RefObject } from "react";

export const CareerScrollContext =
  createContext<RefObject<HTMLDivElement | null> | null>(null);

export const useCareerScrollContainer =
  (): RefObject<HTMLDivElement | null> => {
    const containerRef = use(CareerScrollContext);
    if (!containerRef) {
      throw new Error(
        "useCareerScrollContainer must be inside RunnerContainer"
      );
    }
    return containerRef;
  };
