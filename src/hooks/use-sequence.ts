import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useCounter, useUnmount } from "usehooks-ts";

type SequenceStatus = "idle" | "running" | "complete" | "error";

type Step<TData = unknown> = {
  id: string;
  action?: () => Promise<TData> | TData;
};

type UseSequenceOptions<TData> = {
  steps: Step<TData>[];
  autoStart?: boolean;
  autoSequence?: boolean;
  delay?: number;
  loop?: number;
  loopDelay?: number;
  onStepComplete?: (stepId: string, data?: TData) => void;
  onComplete?: () => void;
  onLoop?: (loopCount: number) => void;
  onError?: (error: Error, stepId: string) => void;
};

function useStableSteps<TData>(steps: Step<TData>[]) {
  const stepsRef = useRef(steps);

  const hasStepsChanged =
    steps.length !== stepsRef.current.length ||
    steps.some((step, index) => step.id !== stepsRef.current[index]?.id);

  if (hasStepsChanged) {
    stepsRef.current = steps;
  }

  return stepsRef.current;
}

export function useSequence<TData = unknown>({
  steps,
  autoStart = false,
  autoSequence = false,
  delay = 0,
  loop = 0,
  loopDelay,
  onStepComplete,
  onComplete,
  onLoop,
  onError,
}: UseSequenceOptions<TData>) {
  const [currentIndex, setCurrentIndex] = useState(autoStart ? 0 : -1);
  const [status, setStatus] = useState<SequenceStatus>("idle");
  const [error, setError] = useState<Error | null>(null);
  const {
    count: loopCount,
    increment: incrementLoopCount,
    reset: resetLoopCount,
  } = useCounter(0);

  const stableSteps = useStableSteps(steps);
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentStep = stableSteps[currentIndex] ?? null;
  const isComplete = currentIndex >= stableSteps.length;
  const progress =
    stableSteps.length > 0
      ? Math.min(currentIndex + 1, stableSteps.length) / stableSteps.length
      : 0;

  const hasRemainingLoops = loop > 0 && loopCount < loop - 1;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex >= stableSteps.length - 1;
  const canGoNext =
    status !== "running" &&
    currentIndex >= 0 &&
    currentIndex < stableSteps.length;
  const canGoPrev = status !== "running" && currentIndex > 0;
  const stepCount = stableSteps.length;
  const isRunning = status === "running";
  const isIdle = status === "idle";
  const hasError = status === "error";

  const executeStep = useEffectEvent(async (index: number) => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const step = stableSteps[index];
    if (!step) {
      setStatus("complete");
      onComplete?.();
      return;
    }

    setStatus("running");

    try {
      const result = step.action ? await step.action() : undefined;

      if (signal.aborted) {
        return;
      }

      onStepComplete?.(step.id, result as TData);

      const nextIndex = index + 1;
      const isLastStep = nextIndex >= stableSteps.length;

      if (isLastStep) {
        setCurrentIndex(nextIndex);
        setStatus("complete");
        onComplete?.();
      } else {
        setCurrentIndex(nextIndex);
        setStatus("idle");
      }
    } catch (err) {
      if (signal.aborted) {
        return;
      }

      const stepError = err instanceof Error ? err : new Error(String(err));
      setError(stepError);
      setStatus("error");
      onError?.(stepError, step.id);
    }
  });

  const start = () => {
    setCurrentIndex(0);
    setStatus("idle");
    setError(null);
  };

  const goNext = () => {
    if (status === "running") {
      return;
    }
    executeStep(currentIndex);
  };

  const reset = () => {
    abortControllerRef.current?.abort();
    setCurrentIndex(-1);
    setStatus("idle");
    setError(null);
    resetLoopCount();
  };

  const jumpTo = (stepId: string) => {
    const index = stableSteps.findIndex((s) => s.id === stepId);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  };

  const goPrev = () => {
    if (status === "running" || currentIndex <= 0) {
      return;
    }
    abortControllerRef.current?.abort();
    setCurrentIndex((prev) => prev - 1);
    setStatus("idle");
    setError(null);
  };

  const restartLoop = useEffectEvent(() => {
    onLoop?.(loopCount + 1);
    incrementLoopCount();
    setCurrentIndex(0);
    setStatus("idle");
  });

  useEffect(() => {
    const canAutoSequence =
      autoSequence &&
      status === "idle" &&
      currentIndex >= 0 &&
      currentIndex < stableSteps.length;

    if (!canAutoSequence) {
      return;
    }

    const timeoutId = setTimeout(() => {
      executeStep(currentIndex);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [autoSequence, status, currentIndex, stableSteps.length, delay]);

  useEffect(() => {
    const shouldRestartLoop = status === "complete" && hasRemainingLoops;

    if (!shouldRestartLoop) {
      return;
    }

    const restartDelay = loopDelay ?? delay;
    const timeoutId = setTimeout(restartLoop, restartDelay);

    return () => clearTimeout(timeoutId);
  }, [status, hasRemainingLoops, loopDelay, delay]);

  useUnmount(() => abortControllerRef.current?.abort());

  return {
    currentStep,
    currentIndex,
    status,
    error,
    progress,
    loopCount,
    isFirst,
    isLast,
    isComplete,
    canGoNext,
    canGoPrev,
    stepCount,
    isRunning,
    isIdle,
    hasError,
    start,
    goNext,
    goPrev,
    jumpTo,
    reset,
  };
}
