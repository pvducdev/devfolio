import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useStep, useUnmount } from "usehooks-ts";
import { useMount } from "@/hooks/use-mount.ts";

interface UseAutoStepOptions {
  maxStep: number;
  initialStep?: number;
  autoAdvance?: boolean;
  delay?: number;
  loop?: boolean;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
  onLoop?: (count: number) => void;
}

interface UseAutoStepReturn {
  currentStep: number;
  loopCount: number;
  isAutoAdvancing: boolean;
  isFirst: boolean;
  isLast: boolean;
  progress: number;
  canGoToNextStep: boolean;
  canGoToPrevStep: boolean;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  setStep: (step: number) => void;
  reset: () => void;
  start: () => void;
  pause: () => void;
  toggle: () => void;
}

export function useAutoStep(options: UseAutoStepOptions): UseAutoStepReturn {
  const {
    maxStep,
    initialStep = 1,
    autoAdvance = false,
    delay = 1000,
    loop = false,
    onStepChange,
    onComplete,
    onLoop,
  } = options;

  const safeMaxStep = Math.max(1, maxStep);
  const safeInitialStep = Math.max(1, Math.min(initialStep, safeMaxStep));

  const [currentStep, stepHelpers] = useStep(safeMaxStep);
  const {
    canGoToNextStep,
    canGoToPrevStep,
    goToNextStep: stepNext,
    goToPrevStep: stepPrev,
    setStep: setStepInternal,
    reset: resetStep,
  } = stepHelpers;

  const [isAutoAdvancing, setIsAutoAdvancing] = useState(autoAdvance);
  const [loopCount, setLoopCount] = useState(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(false);
  const loopCountRef = useRef(0);

  const onStepChangeEvent = useEffectEvent((step: number) => {
    onStepChange?.(step);
  });

  const onCompleteEvent = useEffectEvent(() => {
    onComplete?.();
  });

  const onLoopEvent = useEffectEvent((count: number) => {
    onLoop?.(count);
  });

  // Shared loop reset logic - uses ref to avoid calling useEffectEvent during render
  const handleLoopReset = useEffectEvent(() => {
    onCompleteEvent();
    loopCountRef.current += 1;
    setLoopCount(loopCountRef.current);
    onLoopEvent(loopCountRef.current);
    resetStep();
  });

  const advanceStep = useEffectEvent(() => {
    if (currentStep === safeMaxStep && loop) {
      handleLoopReset();
    } else {
      stepNext();
    }
  });

  useMount(() => {
    if (safeInitialStep !== 1) {
      setStepInternal(safeInitialStep);
    }
  });

  useEffect(() => {
    if (currentStep > safeMaxStep) {
      setStepInternal(safeMaxStep);
    }
  }, [safeMaxStep, currentStep, setStepInternal]);

  const isFirst = currentStep === 1;
  const isLast = currentStep === safeMaxStep;
  const progress =
    safeMaxStep === 1 ? 1 : (currentStep - 1) / (safeMaxStep - 1);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    onStepChangeEvent(currentStep);
  }, [currentStep]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: currentStep resets timer on each step change
  useEffect(() => {
    if (!isAutoAdvancing || delay <= 0) {
      return;
    }

    if (isLast && !loop) {
      onCompleteEvent();
      setIsAutoAdvancing(false);
      return;
    }

    timeoutRef.current = setTimeout(advanceStep, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isAutoAdvancing, currentStep, isLast, loop, delay]);

  useUnmount(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  });

  const goToNextStep = () => {
    if (canGoToNextStep) {
      stepNext();
    } else if (loop) {
      handleLoopReset();
    }
  };

  const goToPrevStep = () => {
    if (canGoToPrevStep) {
      stepPrev();
    }
  };

  const setStep = (step: number) => {
    const clampedStep = Math.max(1, Math.min(step, safeMaxStep));
    setStepInternal(clampedStep);
  };

  const reset = () => {
    resetStep();
    loopCountRef.current = 0;
    setLoopCount(0);
    setIsAutoAdvancing(autoAdvance);
  };

  const start = () => setIsAutoAdvancing(true);
  const pause = () => setIsAutoAdvancing(false);
  const toggle = () => setIsAutoAdvancing((prev) => !prev);

  return {
    currentStep,
    loopCount,
    isAutoAdvancing,
    isFirst,
    isLast,
    progress,
    canGoToNextStep,
    canGoToPrevStep,
    goToNextStep,
    goToPrevStep,
    setStep,
    reset,
    start,
    pause,
    toggle,
  };
}
