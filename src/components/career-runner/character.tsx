import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect } from "react";
import { CHARACTER_CONFIG } from "@/components/career-timeline/config";
import { cn } from "@/lib/utils.ts";
import { useCareerLooping, useCharacterAnimationState } from "@/store/career";

export default function Character() {
  const animationState = useCharacterAnimationState();
  const careerLooping = useCareerLooping();

  const { rive, RiveComponent } = useRive({
    src: CHARACTER_CONFIG.src,
    stateMachines: CHARACTER_CONFIG.stateMachine,
    autoplay: true,
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
        width: CHARACTER_CONFIG.size.width,
        height: CHARACTER_CONFIG.size.height,
      }}
    >
      <RiveComponent />
    </div>
  );
}
