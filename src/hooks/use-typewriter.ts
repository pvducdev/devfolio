import { useCallback, useEffect, useRef, useState } from "react";

export type TypewriterMode = "character" | "word";

export type TypewriterState = "idle" | "typing" | "paused" | "completed";

export type SpeedPreset = "slow" | "normal" | "fast" | "instant";

export type SpeedStage = {
  duration: number;
  speed: number;
};

export type UseTypewriterOptions = {
  speed?: number | SpeedPreset;
  speedStages?: SpeedStage[];
  mode?: TypewriterMode;
  skipAnimation?: boolean;
  loop?: boolean;
  startDelay?: number;
  onComplete?: () => void;
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onProgress?: (progress: number) => void;
};

export type UseTypewriterReturn = {
  displayedText: string;
  state: TypewriterState;
  progress: number;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
  restart: () => void;
};

const MILLISECONDS_PER_SECOND = 1000;
const TEXT_LOOP_DELAY_MS = 500;
const WORD_SPLIT_REGEX = /(\s+)/;

const SPEED_PRESETS: Record<SpeedPreset, number> = {
  slow: 20,
  normal: 30,
  fast: 60,
  instant: Number.POSITIVE_INFINITY,
};

function calculateUnitsToShow(
  elapsed: number,
  speedStages: SpeedStage[]
): number {
  let totalUnits = 0;
  let timeAccumulated = 0;

  for (const stage of speedStages) {
    const stageEndTime = timeAccumulated + stage.duration;

    if (
      elapsed <= stageEndTime ||
      stage.duration === Number.POSITIVE_INFINITY
    ) {
      const timeInStage = elapsed - timeAccumulated;
      const unitsInStage =
        (timeInStage / MILLISECONDS_PER_SECOND) * stage.speed;
      totalUnits += unitsInStage;
      break;
    }

    const stageUnits = (stage.duration / MILLISECONDS_PER_SECOND) * stage.speed;
    totalUnits += stageUnits;
    timeAccumulated += stage.duration;
  }

  return Math.floor(totalUnits);
}

function splitTextIntoUnits(text: string, mode: TypewriterMode): string[] {
  if (mode === "word") {
    return text.split(WORD_SPLIT_REGEX).filter((unit) => unit.length > 0);
  }
  return text.split("");
}

type AnimationCompleteOptions = {
  currentText: string;
  loop: boolean;
  currentTextIndex: number;
  textsLength: number;
  loopTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  setDisplayedText: (text: string) => void;
  setProgress: (progress: number) => void;
  setState: (state: TypewriterState) => void;
  setCurrentTextIndex: (index: number | ((prev: number) => number)) => void;
  onComplete?: () => void;
};

function handleAnimationComplete(options: AnimationCompleteOptions): void {
  const {
    currentText,
    loop,
    currentTextIndex,
    textsLength,
    loopTimeoutRef,
    setDisplayedText,
    setProgress,
    setState,
    setCurrentTextIndex,
    onComplete,
  } = options;

  setDisplayedText(currentText);
  setProgress(1);
  setState("completed");

  if (loop && currentTextIndex < textsLength - 1) {
    loopTimeoutRef.current = setTimeout(() => {
      setCurrentTextIndex((prev) => prev + 1);
    }, TEXT_LOOP_DELAY_MS);
  } else if (loop && currentTextIndex === textsLength - 1) {
    loopTimeoutRef.current = setTimeout(() => {
      setCurrentTextIndex(0);
    }, TEXT_LOOP_DELAY_MS);
  } else {
    onComplete?.();
  }
}

type AnimationDisplayOptions = {
  units: string[];
  unitsToShow: number;
  totalUnits: number;
  setDisplayedText: (text: string) => void;
  setProgress: (progress: number) => void;
  onProgress?: (progress: number) => void;
};

function updateAnimationDisplay(options: AnimationDisplayOptions): void {
  const {
    units,
    unitsToShow,
    totalUnits,
    setDisplayedText,
    setProgress,
    onProgress,
  } = options;

  const textToShow = units.slice(0, unitsToShow).join("");
  setDisplayedText(textToShow);

  const currentProgress = totalUnits > 0 ? unitsToShow / totalUnits : 1;
  setProgress(currentProgress);
  onProgress?.(currentProgress);
}

type CreateAnimateOptions = {
  units: string[];
  totalUnits: number;
  currentText: string;
  loop: boolean;
  currentTextIndex: number;
  textsLength: number;
  isPausedRef: React.MutableRefObject<boolean>;
  startTimeRef: React.MutableRefObject<number | null>;
  pausedAtRef: React.MutableRefObject<number>;
  rafIdRef: React.MutableRefObject<number | null>;
  stagesRef: React.MutableRefObject<SpeedStage[]>;
  loopTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  setDisplayedText: (text: string) => void;
  setProgress: (progress: number) => void;
  setState: (state: TypewriterState) => void;
  setCurrentTextIndex: (index: number | ((prev: number) => number)) => void;
  onProgressRef: React.MutableRefObject<
    ((progress: number) => void) | undefined
  >;
  onCompleteRef: React.MutableRefObject<(() => void) | undefined>;
};

function createAnimateFunction(
  options: CreateAnimateOptions
): (timestamp: number) => void {
  const {
    units,
    totalUnits,
    currentText,
    loop,
    currentTextIndex,
    textsLength,
    isPausedRef,
    startTimeRef,
    pausedAtRef,
    rafIdRef,
    stagesRef,
    loopTimeoutRef,
    setDisplayedText,
    setProgress,
    setState,
    setCurrentTextIndex,
    onProgressRef,
    onCompleteRef,
  } = options;

  return (timestamp: number) => {
    if (isPausedRef.current) {
      pausedAtRef.current = timestamp;
      return;
    }

    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const unitsToShow = Math.min(
      calculateUnitsToShow(elapsed, stagesRef.current),
      totalUnits
    );

    updateAnimationDisplay({
      units,
      unitsToShow,
      totalUnits,
      setDisplayedText,
      setProgress,
      onProgress: onProgressRef.current,
    });

    if (unitsToShow < totalUnits) {
      rafIdRef.current = requestAnimationFrame(createAnimateFunction(options));
    } else {
      rafIdRef.current = null;
      startTimeRef.current = null;

      handleAnimationComplete({
        currentText,
        loop,
        currentTextIndex,
        textsLength,
        loopTimeoutRef,
        setDisplayedText,
        setProgress,
        setState,
        setCurrentTextIndex,
        onComplete: onCompleteRef.current,
      });
    }
  };
}

export function useTypewriter(
  text: string | string[],
  options: UseTypewriterOptions = {}
): UseTypewriterReturn {
  const {
    speed = "normal",
    speedStages,
    mode = "character",
    skipAnimation = false,
    loop = false,
    startDelay = 0,
    onComplete,
    onStart,
    onPause,
    onResume,
    onProgress,
  } = options;

  const texts = Array.isArray(text) ? text : [text];

  const resolvedSpeed =
    typeof speed === "string" ? SPEED_PRESETS[speed] : speed;

  let normalizedStages: SpeedStage[];
  if (speedStages && speedStages.length > 0) {
    const validStages = speedStages.filter(
      (stage) => stage.duration > 0 && stage.speed > 0
    );

    normalizedStages =
      validStages.length > 0
        ? validStages
        : [{ duration: Number.POSITIVE_INFINITY, speed: resolvedSpeed }];
  } else {
    normalizedStages = [
      { duration: Number.POSITIVE_INFINITY, speed: resolvedSpeed },
    ];
  }

  const [displayedText, setDisplayedText] = useState("");
  const [state, setState] = useState<TypewriterState>("idle");
  const [progress, setProgress] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const rafIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number>(0);
  const isPausedRef = useRef(false);
  const startDelayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onCompleteRef = useRef(onComplete);
  const onStartRef = useRef(onStart);
  const onPauseRef = useRef(onPause);
  const onResumeRef = useRef(onResume);
  const onProgressRef = useRef(onProgress);
  const stagesRef = useRef(normalizedStages);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onStartRef.current = onStart;
  }, [onStart]);

  useEffect(() => {
    onPauseRef.current = onPause;
  }, [onPause]);

  useEffect(() => {
    onResumeRef.current = onResume;
  }, [onResume]);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    stagesRef.current = normalizedStages;
  }, [normalizedStages]);

  const pause = useCallback(() => {
    if (isPausedRef.current || state !== "typing") {
      return;
    }

    isPausedRef.current = true;
    setState("paused");

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    onPauseRef.current?.();
  }, [state]);

  const resume = useCallback(() => {
    if (!isPausedRef.current || state !== "paused") {
      return;
    }

    isPausedRef.current = false;
    setState("typing");

    if (startTimeRef.current !== null) {
      const pauseDuration = performance.now() - pausedAtRef.current;
      startTimeRef.current += pauseDuration;
    }

    onResumeRef.current?.();
  }, [state]);

  const reset = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (startDelayTimeoutRef.current) {
      clearTimeout(startDelayTimeoutRef.current);
      startDelayTimeoutRef.current = null;
    }

    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }

    setDisplayedText("");
    setState("idle");
    setProgress(0);
    setCurrentTextIndex(0);
    startTimeRef.current = null;
    pausedAtRef.current = 0;
    isPausedRef.current = false;
  }, []);

  const skip = useCallback(() => {
    if (state === "completed") {
      return;
    }

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    const currentText = texts[currentTextIndex];
    setDisplayedText(currentText);
    setProgress(1);
    setState("completed");
    onCompleteRef.current?.();
  }, [state, texts, currentTextIndex]);

  const restart = useCallback(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    const currentText = texts[currentTextIndex];

    if (skipAnimation || resolvedSpeed === Number.POSITIVE_INFINITY) {
      setDisplayedText(currentText);
      setProgress(1);
      setState("completed");
      return;
    }

    if (!currentText) {
      setDisplayedText("");
      setProgress(0);
      setState("idle");
      return;
    }

    setDisplayedText("");
    setProgress(0);
    setState("idle");
    startTimeRef.current = null;
    isPausedRef.current = false;

    const startAnimation = () => {
      setState("typing");
      onStartRef.current?.();

      const units = splitTextIntoUnits(currentText, mode);
      const totalUnits = units.length;

      const animate = createAnimateFunction({
        units,
        totalUnits,
        currentText,
        loop,
        currentTextIndex,
        textsLength: texts.length,
        isPausedRef,
        startTimeRef,
        pausedAtRef,
        rafIdRef,
        stagesRef,
        loopTimeoutRef,
        setDisplayedText,
        setProgress,
        setState,
        setCurrentTextIndex,
        onProgressRef,
        onCompleteRef,
      });

      rafIdRef.current = requestAnimationFrame(animate);
    };

    if (startDelay > 0) {
      startDelayTimeoutRef.current = setTimeout(startAnimation, startDelay);
    } else {
      startAnimation();
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (startDelayTimeoutRef.current) {
        clearTimeout(startDelayTimeoutRef.current);
        startDelayTimeoutRef.current = null;
      }
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
        loopTimeoutRef.current = null;
      }
    };
  }, [
    texts,
    currentTextIndex,
    skipAnimation,
    resolvedSpeed,
    mode,
    loop,
    startDelay,
  ]);

  useEffect(() => {
    if (
      state === "typing" &&
      !isPausedRef.current &&
      rafIdRef.current === null
    ) {
      const currentText = texts[currentTextIndex];
      const units = splitTextIntoUnits(currentText, mode);
      const totalUnits = units.length;

      const animate = createAnimateFunction({
        units,
        totalUnits,
        currentText,
        loop,
        currentTextIndex,
        textsLength: texts.length,
        isPausedRef,
        startTimeRef,
        pausedAtRef,
        rafIdRef,
        stagesRef,
        loopTimeoutRef,
        setDisplayedText,
        setProgress,
        setState,
        setCurrentTextIndex,
        onProgressRef,
        onCompleteRef,
      });

      rafIdRef.current = requestAnimationFrame(animate);
    }
  }, [state, texts, currentTextIndex, mode, loop]);

  return {
    displayedText,
    state,
    progress,
    pause,
    resume,
    reset,
    skip,
    restart,
  };
}
