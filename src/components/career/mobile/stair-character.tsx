import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import type { MotionValue } from "motion/react";
import { motion, useSpring, useTransform } from "motion/react";
import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { CHARACTER_CONFIG } from "@/components/career-runner/config";
import { useCharacterAnimationState } from "@/store/career";

const CHARACTER_SIZE = 48;

interface StairCharacterProps {
  sectionRefs: RefObject<HTMLDivElement | null>[];
  scrollYProgress: MotionValue<number>;
}

function useSectionOffsets(refs: RefObject<HTMLDivElement | null>[]) {
  const [offsets, setOffsets] = useState<number[]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      const values = refs.map(
        (ref) => (ref.current?.offsetTop ?? 0) - CHARACTER_SIZE + 4
      );
      setOffsets(values);
    };

    measure();

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(measure);
    });

    for (const ref of refs) {
      if (ref.current) {
        observer.observe(ref.current);
      }
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [refs]);

  return offsets;
}

export default function StairCharacter({
  sectionRefs,
  scrollYProgress,
}: StairCharacterProps) {
  const animationState = useCharacterAnimationState();
  const offsets = useSectionOffsets(sectionRefs);

  const count = offsets.length;
  const inputRange = count > 1 ? offsets.map((_, i) => i / (count - 1)) : [0];
  const outputRange = count > 1 ? offsets : [0];

  const rawY = useTransform(scrollYProgress, inputRange, outputRange);
  const smoothY = useSpring(rawY, {
    stiffness: 120,
    damping: 22,
    restDelta: 0.5,
  });

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

  if (count === 0) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute -left-6 z-10"
      style={{ top: smoothY, width: CHARACTER_SIZE, height: CHARACTER_SIZE }}
    >
      <RiveComponent />
    </motion.div>
  );
}
