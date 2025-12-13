import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useStep, useUnmount } from "usehooks-ts";

type UseAutoStepOptions = {
  maxStep: number;
  initialStep?: number;
  autoAdvance?: boolean;
  delay?: number;
  loop?: boolean;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
  onLoop?: (count: number) => void;
};

type UseAutoStepReturn = {
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
};

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
  const initializedRef = useRef(false);

  const onStepChangeEvent = useEffectEvent((step: number) => {
    onStepChange?.(step);
  });

  const onCompleteEvent = useEffectEvent(() => {
    onComplete?.();
  });

  const onLoopEvent = useEffectEvent((count: number) => {
    onLoop?.(count);
  });

  const advanceStep = useEffectEvent(() => {
    if (currentStep === safeMaxStep && loop) {
      onCompleteEvent();
      const nextLoopCount = loopCount + 1;
      setLoopCount(nextLoopCount);
      onLoopEvent(nextLoopCount);
      resetStep();
    } else {
      stepNext();
    }
  });

  if (!initializedRef.current) {
    initializedRef.current = true;
    if (initialStep !== 1 && initialStep >= 1 && initialStep <= safeMaxStep) {
      setStepInternal(initialStep);
    }
  }

  const isFirst = currentStep === 1;
  const isLast = currentStep === safeMaxStep;
  const progress =
    safeMaxStep === 1 ? 1 : (currentStep - 1) / (safeMaxStep - 1);

  useEffect(() => {
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
    }
  });

  const goToNextStep = () => {
    if (canGoToNextStep) {
      stepNext();
    } else if (loop) {
      const nextLoopCount = loopCount + 1;
      setLoopCount(nextLoopCount);
      onLoopEvent(nextLoopCount);
      resetStep();
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
    canGoToNextStep: canGoToNextStep || loop,
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
