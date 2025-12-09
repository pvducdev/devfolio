import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect } from "react";
import { CHARACTER_CONFIG } from "@/config/career-timeline";
import {
  useCareerActiveSection,
  useCareerLooping,
  useCareerScrolling,
} from "@/store/career";

export default function Character() {
  const activeSection = useCareerActiveSection();
  const careerScrolling = useCareerScrolling();
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

    const { states } = CHARACTER_CONFIG;

    if (careerLooping) {
      stateInput.value = states.running;
    } else if (activeSection) {
      stateInput.value = states.milestone;
    } else if (careerScrolling) {
      stateInput.value = states.running;
    } else {
      stateInput.value = states.idle;
    }
  }, [activeSection, stateInput, careerLooping, careerScrolling]);

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
