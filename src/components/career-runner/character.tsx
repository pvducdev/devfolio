import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { useCareerLooping, useCharacterAnimationState } from "@/store/career";

import { CHARACTER_CONFIG } from "./config";

export default function Character() {
  const animationState = useCharacterAnimationState();
  const careerLooping = useCareerLooping();

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
    if (!stateInput) {
      return;
    }
    stateInput.value = CHARACTER_CONFIG.states[animationState];
  }, [animationState, stateInput]);

  return (
    <div
      className={cn(
        "transition-transform",
        careerLooping ? "rotate-y-180" : ""
      )}
      style={{
        aspectRatio: `${CHARACTER_CONFIG.size.width} / ${CHARACTER_CONFIG.size.height}`,
        height: CHARACTER_CONFIG.size.height,
        width: CHARACTER_CONFIG.size.width,
      }}
    >
      <RiveComponent />
    </div>
  );
}
