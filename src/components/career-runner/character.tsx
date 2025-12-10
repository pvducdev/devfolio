import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect } from "react";
import { CHARACTER_CONFIG } from "@/config/career-timeline";
import { useCharacterAnimationState } from "@/store/career";

export default function Character() {
  const animationState = useCharacterAnimationState();

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
      style={{
        width: CHARACTER_CONFIG.size.width,
        height: CHARACTER_CONFIG.size.height,
      }}
    >
      <RiveComponent />
    </div>
  );
}
