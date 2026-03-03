import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { motion, useSpring } from "motion/react";
import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import { CHARACTER_CONFIG } from "@/components/career-runner/config";
import { useCharacterAnimationState } from "@/store/career";

const CHARACTER_SIZE = 48;

interface StairCharacterProps {
  sectionRefs: RefObject<HTMLDivElement | null>[];
  activeIndex: number;
}

export default function StairCharacter({
  sectionRefs,
  activeIndex,
}: StairCharacterProps) {
  const animationState = useCharacterAnimationState();
  const targetY = useRef(0);
  const springY = useSpring(0, { stiffness: 100, damping: 18 });

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

  useEffect(() => {
    if (activeIndex < 0 || activeIndex >= sectionRefs.length) {
      return;
    }

    const el = sectionRefs[activeIndex].current;
    if (!el) {
      return;
    }

    targetY.current = el.offsetTop - CHARACTER_SIZE + 4;
    springY.set(targetY.current);
  }, [activeIndex, sectionRefs, springY]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute -left-6 z-10"
      style={{ top: springY, width: CHARACTER_SIZE, height: CHARACTER_SIZE }}
    >
      <RiveComponent />
    </motion.div>
  );
}
