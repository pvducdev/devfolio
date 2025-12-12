import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useCounter, useUnmount } from "usehooks-ts";

const NOT_STARTED_INDEX = -1;
const FIRST_STEP_INDEX = 0;

type SequenceStatus = "idle" | "running" | "paused" | "complete" | "error";

type Step<TData = unknown> = {
  id: string;
  action?: (signal: AbortSignal) => Promise<TData> | TData;
};

type UseSequenceOptions<TData> = {
  steps: Step<TData>[];
  autoStart?: boolean;
  autoSequence?: boolean;
  delay?: number;
  completionDelay?: number;
  repeatCount?: number;
  repeatDelay?: number;
  onStepComplete?: (stepId: string, data?: TData) => void;
  onComplete?: () => void;
  onRepeat?: (count: number) => void;
  onError?: (error: Error, stepId: string) => void;
};

export function useSequence<TData = unknown>({
  steps,
  autoStart = false,
  autoSequence = false,
  delay = 0,
  completionDelay,
  repeatCount = 0,
  repeatDelay,
  onStepComplete,
  onComplete,
  onRepeat,
  onError,
}: UseSequenceOptions<TData>) {
  const [pendingIndex, setPendingIndex] = useState(
    autoStart ? FIRST_STEP_INDEX : NOT_STARTED_INDEX
  );
  const [status, setStatus] = useState<SequenceStatus>("idle");
  const [error, setError] = useState<Error | null>(null);
  const {
    count: currentRepeat,
    increment: incrementRepeat,
    reset: resetRepeat,
  } = useCounter(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const onCompleteCalledRef = useRef(false);

  const pendingStep = steps[pendingIndex];
  const isStarted = pendingIndex >= FIRST_STEP_INDEX;
  const progress =
    steps.length > 0 && isStarted
      ? Math.min(pendingIndex + 1, steps.length) / steps.length
      : 0;

  const hasRemainingRepeats = repeatCount > 0 && currentRepeat < repeatCount;

  const isRunning = status === "running";
  const isIdle = status === "idle";
  const isPaused = status === "paused";
  const isComplete = status === "complete";
  const hasError = status === "error";

  const isValidIndex =
    pendingIndex >= FIRST_STEP_INDEX && pendingIndex < steps.length;
  const isFirst = isValidIndex && pendingIndex === FIRST_STEP_INDEX;
  const isLast = isValidIndex && pendingIndex === steps.length - 1;

  const canAdvance = !(isRunning || isPaused) && isValidIndex;
  const canGoPrev = !(isRunning || isPaused) && pendingIndex > FIRST_STEP_INDEX;
  const canPause = isRunning;
  const canResume = isPaused && isValidIndex;

  const cleanup = () => {
    abortControllerRef.current?.abort();
    onCompleteCalledRef.current = false;
    setStatus("idle");
    setError(null);
  };

  const handleComplete = useEffectEvent(() => {
    if (onCompleteCalledRef.current) {
      return;
    }
    onCompleteCalledRef.current = true;
    onComplete?.();
  });

  const executeStep = useEffectEvent(async (index: number) => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const step = steps[index];
    if (!step) {
      setStatus("complete");
      return;
    }

    setStatus("running");

    try {
      const result = step.action ? await step.action(signal) : undefined;

      if (signal.aborted) {
        return;
      }

      onStepComplete?.(step.id, result);

      const nextIndex = index + 1;
      const isLastStep = nextIndex >= steps.length;

      setPendingIndex(nextIndex);

      if (isLastStep) {
        setStatus("complete");
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
    if (steps.length === 0) {
      return;
    }
    cleanup();
    setPendingIndex(FIRST_STEP_INDEX);
    resetRepeat();
  };

  const advance = () => {
    if (isRunning || !isValidIndex) {
      return;
    }

    executeStep(pendingIndex);
  };

  const reset = () => {
    cleanup();
    setPendingIndex(NOT_STARTED_INDEX);
    resetRepeat();
  };

  const jumpTo = (stepId: string) => {
    if (isRunning || isPaused) {
      return;
    }
    const index = steps.findIndex((s) => s.id === stepId);
    if (index !== -1) {
      cleanup();
      setPendingIndex(index);
    }
  };

  const goPrev = () => {
    if (isRunning || isPaused || pendingIndex <= FIRST_STEP_INDEX) {
      return;
    }
    cleanup();
    setPendingIndex((prev) => prev - 1);
  };

  const pause = () => {
    if (!isRunning) {
      return;
    }
    abortControllerRef.current?.abort();
    setStatus("paused");
  };

  const resume = () => {
    if (!(isPaused && isValidIndex)) {
      return;
    }
    setStatus("idle");
    executeStep(pendingIndex);
  };

  const restartRepeat = useEffectEvent(() => {
    onRepeat?.(currentRepeat + 1);
    incrementRepeat();
    setPendingIndex(FIRST_STEP_INDEX);
    setStatus("idle");
    setError(null);
  });

  useEffect(() => {
    if (!autoSequence || status !== "idle" || !isValidIndex) {
      return;
    }

    const timeoutId = setTimeout(() => {
      executeStep(pendingIndex);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [autoSequence, pendingIndex, delay, status, isValidIndex]);

  useEffect(() => {
    if (status !== "complete" || hasRemainingRepeats) {
      return;
    }

    const finalDelay = completionDelay ?? (autoSequence ? delay : 0);

    if (finalDelay === 0) {
      handleComplete();
      return;
    }

    const timeoutId = setTimeout(handleComplete, finalDelay);
    return () => clearTimeout(timeoutId);
  }, [status, autoSequence, hasRemainingRepeats, completionDelay, delay]);

  useEffect(() => {
    if (status !== "complete" || !hasRemainingRepeats) {
      return;
    }

    const restartDelay = repeatDelay ?? delay;
    const timeoutId = setTimeout(restartRepeat, restartDelay);
    return () => clearTimeout(timeoutId);
  }, [status, hasRemainingRepeats, repeatDelay, delay]);

  useUnmount(() => abortControllerRef.current?.abort());

  return {
    pendingStep,
    pendingIndex,
    status,
    error,
    progress,
    currentRepeat,
    isStarted,
    isFirst,
    isLast,
    isComplete,
    isPaused,
    canAdvance,
    canGoPrev,
    canPause,
    canResume,
    isRunning,
    isIdle,
    hasError,
    start,
    advance,
    goPrev,
    pause,
    resume,
    jumpTo,
    reset,
  };
}

export type { Step, SequenceStatus, UseSequenceOptions };
