import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useCounter, useUnmount } from "usehooks-ts";

const NOT_STARTED_INDEX = -1;
const FIRST_STEP_INDEX = 0;

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
  const [pendingIndex, setPendingIndex] = useState(
    autoStart ? FIRST_STEP_INDEX : NOT_STARTED_INDEX
  );
  const [status, setStatus] = useState<SequenceStatus>("idle");
  const [error, setError] = useState<Error | null>(null);
  const {
    count: loopCount,
    increment: incrementLoopCount,
    reset: resetLoopCount,
  } = useCounter(0);

  const stableSteps = useStableSteps(steps);
  const abortControllerRef = useRef<AbortController | null>(null);

  const pendingStep = stableSteps[pendingIndex] ?? null;
  const isStarted = pendingIndex >= FIRST_STEP_INDEX;
  const progress =
    stableSteps.length > 0 && isStarted
      ? Math.min(pendingIndex + 1, stableSteps.length) / stableSteps.length
      : 0;

  const hasRemainingLoops = loop > 0 && loopCount < loop - 1;

  const isRunning = status === "running";
  const isIdle = status === "idle";
  const isComplete = status === "complete";
  const hasError = status === "error";
  const isValidIndex =
    pendingIndex >= FIRST_STEP_INDEX && pendingIndex < stableSteps.length;
  const isFirst = isValidIndex && pendingIndex === FIRST_STEP_INDEX;
  const isLast = isValidIndex && pendingIndex === stableSteps.length - 1;

  const canAdvance = !isRunning && isValidIndex;
  const canGoPrev = !isRunning && pendingIndex > FIRST_STEP_INDEX;

  const cleanup = () => {
    abortControllerRef.current?.abort();
    setStatus("idle");
    setError(null);
  };

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

      onStepComplete?.(step.id, result);

      const nextIndex = index + 1;
      const isLastStep = nextIndex >= stableSteps.length;

      setPendingIndex(nextIndex);

      if (isLastStep) {
        setStatus("complete");
        onComplete?.();
      } else {
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
    cleanup();
    setPendingIndex(FIRST_STEP_INDEX);
    resetLoopCount();
  };

  const advance = () => {
    if (!canAdvance) {
      return;
    }
    executeStep(pendingIndex);
  };

  const reset = () => {
    cleanup();
    setPendingIndex(NOT_STARTED_INDEX);
    resetLoopCount();
  };

  const jumpTo = (stepId: string) => {
    if (isRunning) {
      return;
    }
    const index = stableSteps.findIndex((s) => s.id === stepId);
    if (index !== -1) {
      cleanup();
      setPendingIndex(index);
    }
  };

  const goPrev = () => {
    if (isRunning || pendingIndex <= FIRST_STEP_INDEX) {
      return;
    }
    cleanup();
    setPendingIndex((prev) => prev - 1);
  };

  const restartLoop = useEffectEvent(() => {
    onLoop?.(loopCount + 1);
    incrementLoopCount();
    setPendingIndex(FIRST_STEP_INDEX);
    setStatus("idle");
    setError(null);
  });

  useEffect(() => {
    const canAutoSequence = autoSequence && isIdle && isValidIndex;

    if (!canAutoSequence) {
      return;
    }

    const timeoutId = setTimeout(() => {
      executeStep(pendingIndex);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [autoSequence, pendingIndex, delay, isIdle, isValidIndex]);

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
    pendingStep,
    pendingIndex,
    status,
    error,
    progress,
    loopCount,
    isStarted,
    isFirst,
    isLast,
    isComplete,
    canAdvance,
    canGoPrev,
    isRunning,
    isIdle,
    hasError,
    start,
    advance,
    goPrev,
    jumpTo,
    reset,
  };
}
