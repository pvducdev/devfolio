import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect } from "react";
import { CHARACTER_CONFIG } from "@/config/career-timeline";
import { useMilestoneStore } from "@/store/milestone";

type CharacterProps = {
  isRunning: boolean;
};

export function Character({ isRunning }: CharacterProps) {
  const isInMilestoneZone = useMilestoneStore((s) => s.isInMilestoneZone);

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

    if (isInMilestoneZone) {
      // Celebration state
      stateInput.value = CHARACTER_CONFIG.celebrationValue;
    } else if (isRunning) {
      // Running state
      stateInput.value = 1;
    } else {
      // Idle state
      stateInput.value = 0;
    }
  }, [isInMilestoneZone, isRunning, stateInput]);

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
