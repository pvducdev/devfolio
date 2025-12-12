import { useMemo } from "react";
import type { ProjectConfig } from "@/config/projects";
import { useSequence } from "./use-sequence";

type Guide = ProjectConfig["guides"][number];

type UseGuideSequenceOptions = {
  guides: Guide[];
  autoStart?: boolean;
  autoSequence?: boolean;
  delay?: number;
  loop?: number;
  onComplete?: () => void;
};

export function useGuideSequence({
  guides,
  autoStart = false,
  autoSequence = false,
  delay = 2000,
  loop,
  onComplete,
}: UseGuideSequenceOptions) {
  const steps = useMemo(
    () => [{ id: "loading" }, ...guides.map((_, i) => ({ id: `guide-${i}` }))],
    [guides]
  );

  const sequence = useSequence({
    steps,
    autoStart,
    autoSequence,
    delay,
    loop,
    onComplete,
  });

  const guideIndex = sequence.currentIndex - 1;
  const currentGuide =
    guideIndex >= 0 && guideIndex < guides.length ? guides[guideIndex] : null;
  const visitedGuides = guides.slice(0, Math.max(0, guideIndex + 1));

  const isLoading = sequence.currentStep?.id === "loading";

  return {
    ...sequence,
    currentGuide,
    visitedGuides,
    isLoading,
  };
}
