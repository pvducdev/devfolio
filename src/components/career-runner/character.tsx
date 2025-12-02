import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect } from "react";
import { CHARACTER_CONFIG } from "@/config/career-timeline";

type CharacterProps = {
  isRunning: boolean;
};

export function Character({ isRunning }: CharacterProps) {
  const { rive, RiveComponent } = useRive({
    src: CHARACTER_CONFIG.src,
    stateMachines: CHARACTER_CONFIG.stateMachine,
    autoplay: true,
  });

  const runInput = useStateMachineInput(
    rive,
    CHARACTER_CONFIG.stateMachine,
    CHARACTER_CONFIG.runningInput
  );

  useEffect(() => {
    if (runInput) {
      runInput.value = isRunning;
    }
  }, [isRunning, runInput]);

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
