import { useEffect, useState } from "react";

interface UseAutoStepOptions {
  maxStep: number;
  delay: number;
}

export const useAutoStep = ({ maxStep, delay }: UseAutoStepOptions) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentStep((step) => (step >= maxStep ? 1 : step + 1));
    }, delay);
    return () => clearTimeout(timeout);
  }, [isPlaying, currentStep, maxStep, delay]);

  const restart = () => {
    setCurrentStep(1);
    setIsPlaying(true);
  };

  const stopAt = (step: number) => {
    setCurrentStep(step);
    setIsPlaying(false);
  };

  return { currentStep, restart, stopAt };
};
