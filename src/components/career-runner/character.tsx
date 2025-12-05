import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { CHARACTER_CONFIG } from "@/config/career-timeline";
import { useCareerStore } from "@/store/career";

type CharacterProps = {
  isRunning: boolean;
};

export function Character({ isRunning }: CharacterProps) {
  const activeSection = useCareerStore(useShallow((s) => s.activeSection));

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

    const { states } = CHARACTER_CONFIG;

    if (activeSection) {
      stateInput.value = states.milestone;
    } else if (isRunning) {
      stateInput.value = states.running;
    } else {
      stateInput.value = states.idle;
    }
  }, [activeSection, isRunning, stateInput]);

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
