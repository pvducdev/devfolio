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
  scrollY: MotionValue<number>;
  scrollRef: RefObject<HTMLDivElement | null>;
}

interface SectionMapping {
  characterYs: number[];
  scrollOffsets: number[];
}

function getOffsetFromContainer(
  element: HTMLElement,
  container: HTMLElement
): number {
  let offset = 0;
  let current: HTMLElement | null = element;
  while (current && current !== container) {
    offset += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return offset;
}

function useSectionMapping(
  refs: RefObject<HTMLDivElement | null>[],
  scrollRef: RefObject<HTMLDivElement | null>
): SectionMapping {
  const [mapping, setMapping] = useState<SectionMapping>({
    characterYs: [],
    scrollOffsets: [],
  });
  const frameRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      const container = scrollRef.current;
      if (!container) {
        return;
      }

      const characterYs: number[] = [];
      const scrollOffsets: number[] = [];

      for (const ref of refs) {
        const el = ref.current;
        if (!el) {
          characterYs.push(0);
          scrollOffsets.push(0);
          continue;
        }
        characterYs.push(el.offsetTop - CHARACTER_SIZE + 4);
        scrollOffsets.push(getOffsetFromContainer(el, container));
      }

      setMapping({ characterYs, scrollOffsets });
    };

    measure();

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(measure);
    });

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }
    for (const ref of refs) {
      if (ref.current) {
        observer.observe(ref.current);
      }
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [refs, scrollRef]);

  return mapping;
}

export default function StairCharacter({
  sectionRefs,
  scrollY,
  scrollRef,
}: StairCharacterProps) {
  const animationState = useCharacterAnimationState();
  const { characterYs, scrollOffsets } = useSectionMapping(
    sectionRefs,
    scrollRef
  );

  const count = characterYs.length;

  const rawY = useTransform(scrollY, (y) => {
    const container = scrollRef.current;
    if (!container || count === 0 || scrollOffsets.length === 0) {
      return 0;
    }

    const sectionsContainerOffset =
      scrollOffsets[0] - (characterYs[0] + CHARACTER_SIZE - 4);

    const viewportCenter =
      y -
      sectionsContainerOffset +
      container.clientHeight / 2 -
      CHARACTER_SIZE / 2;

    const min = characterYs[0];
    const max = characterYs[count - 1];
    return Math.min(Math.max(viewportCenter, min), max);
  });

  const smoothY = useSpring(rawY, {
    damping: 50,
    restDelta: 0.5,
    stiffness: 600,
  });

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

  if (count === 0) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute -left-6 z-10"
      style={{ height: CHARACTER_SIZE, top: smoothY, width: CHARACTER_SIZE }}
    >
      <RiveComponent />
    </motion.div>
  );
}
