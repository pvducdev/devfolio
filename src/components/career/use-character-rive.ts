import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect } from "react";

import { CHARACTER_CONFIG } from "./config";
import { useCharacterAnimationState } from "./store";

export const useCharacterRive = () => {
  const animationState = useCharacterAnimationState();

  const { rive, RiveComponent } = useRive({
    autoplay: true,
    src: CHARACTER_CONFIG.src,
    stateMachines: CHARACTER_CONFIG.stateMachine,
  });

  const stateInput = useStateMachineInput(
    rive,
    CHARACTER_CONFIG.stateMachine,
    CHARACTER_CONFIG.runningInput
  );

  useEffect(() => {
    if (stateInput) {
      stateInput.value = CHARACTER_CONFIG.states[animationState];
    }
  }, [animationState, stateInput]);

  return RiveComponent;
};
