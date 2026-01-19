import { type ComponentProps, useEffect, useState } from "react";
import { useMount } from "@/hooks/use-mount.ts";
import { CHARACTER_CONFIG } from "./config";

type RiveModule = typeof import("@rive-app/react-canvas");

function RiveCanvas({
  rive,
  animationState,
}: {
  rive: RiveModule;
  animationState: keyof typeof CHARACTER_CONFIG.states;
}) {
  const { rive: riveInstance, RiveComponent } = rive.useRive({
    src: CHARACTER_CONFIG.src,
    stateMachines: CHARACTER_CONFIG.stateMachine,
    autoplay: true,
  });

  const stateInput = rive.useStateMachineInput(
    riveInstance,
    CHARACTER_CONFIG.stateMachine,
    CHARACTER_CONFIG.runningInput
  );

  useEffect(() => {
    if (stateInput) {
      stateInput.value = CHARACTER_CONFIG.states[animationState];
    }
  }, [animationState, stateInput]);

  return <RiveComponent />;
}

type RiveCharacterProps = Omit<ComponentProps<typeof RiveCanvas>, "rive">;

export default function RiveCharacter(props: RiveCharacterProps) {
  const [rive, setRive] = useState<RiveModule | null>(null);

  useMount(() => {
    Promise.all([
      import("@rive-app/react-canvas"),
      import("@/lib/rive-init"),
    ]).then(([module]) => setRive(module));
  });

  if (!rive) {
    return null;
  }

  return <RiveCanvas {...props} rive={rive} />;
}
