import { useEffect, useRef, useState } from "react";

export type SpeedStage = {
  duration: number;
  speed: number;
};

export type UseTypewriterOptions = {
  speed?: number;
  speedStages?: SpeedStage[];
  skipAnimation?: boolean;
  onComplete?: () => void;
};

function calculateCharsToShow(
  elapsed: number,
  speedStages: SpeedStage[]
): number {
  const MILLISECONDS_PER_SECOND = 1000;
  let totalChars = 0;
  let timeAccumulated = 0;

  for (const stage of speedStages) {
    const stageEndTime = timeAccumulated + stage.duration;

    if (
      elapsed <= stageEndTime ||
      stage.duration === Number.POSITIVE_INFINITY
    ) {
      const timeInStage = elapsed - timeAccumulated;
      const charsInStage =
        (timeInStage / MILLISECONDS_PER_SECOND) * stage.speed;
      totalChars += charsInStage;
      break;
    }

    const stageChars = (stage.duration / MILLISECONDS_PER_SECOND) * stage.speed;
    totalChars += stageChars;
    timeAccumulated += stage.duration;
  }

  return Math.floor(totalChars);
}

export function useTypewriter(
  text: string,
  options: UseTypewriterOptions = {}
): { displayedText: string } {
  const {
    speed = 30,
    speedStages,
    skipAnimation = false,
    onComplete,
  } = options;

  const normalizedStages: SpeedStage[] = speedStages || [
    { duration: Number.POSITIVE_INFINITY, speed },
  ];

  const [displayedText, setDisplayedText] = useState("");
  const rafIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const previousTextRef = useRef("");
  const targetTextRef = useRef(text);
  const onCompleteRef = useRef(onComplete);
  const stagesRef = useRef(normalizedStages);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    stagesRef.current = normalizedStages;
  }, [normalizedStages]);

  useEffect(() => {
    targetTextRef.current = text;

    if (skipAnimation) {
      setDisplayedText(text);
      return;
    }

    if (!text) {
      setDisplayedText("");
      return;
    }

    const isStreaming =
      previousTextRef.current &&
      text.startsWith(previousTextRef.current) &&
      text.length > previousTextRef.current.length;

    if (isStreaming) {
      previousTextRef.current = text;
    } else {
      setDisplayedText("");
      startTimeRef.current = null;
      previousTextRef.current = text;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const targetLength = targetTextRef.current.length;

      const charsToShow = Math.min(
        calculateCharsToShow(elapsed, stagesRef.current),
        targetLength
      );

      if (charsToShow < targetLength) {
        setDisplayedText(targetTextRef.current.slice(0, charsToShow + 1));
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayedText(targetTextRef.current);
        rafIdRef.current = null;
        startTimeRef.current = null;
        onCompleteRef.current?.();
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [text, skipAnimation]);

  return {
    displayedText,
  };
}
