import { motion, useScroll, useSpring } from "motion/react";
import { lazy, Suspense, useRef } from "react";
import { CAREER_SECTIONS } from "@/components/career-runner/config";
import { useCareerTimeline } from "@/hooks/use-career-timeline";
import CareerEntry from "./career-entry";
import TimelineIntro from "./timeline-intro";
import TimelineOutro from "./timeline-outro";

const StairCharacter = lazy(() => import("./stair-character"));

export default function CareerTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollY, scrollYProgress } = useScroll({ container: scrollRef });

  const { sectionRefs, activeIndex } = useCareerTimeline({
    scrollContainerRef: scrollRef,
    scrollY,
  });

  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="relative h-full overflow-y-auto overflow-x-hidden"
      layoutScroll
      ref={scrollRef}
    >
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.02]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)",
        }}
      />

      <TimelineIntro />

      <div className="relative ml-14 border-border border-l border-dashed">
        <motion.div
          className="absolute top-0 left-0 w-px origin-top bg-gradient-to-b from-primary to-primary/0"
          style={{ height: "100%", scaleY: lineProgress }}
        />

        {CAREER_SECTIONS.map((section, index) => (
          <CareerEntry
            isActive={activeIndex === index}
            key={section.id}
            ref={sectionRefs[index]}
            scrollRef={scrollRef}
            section={section}
          />
        ))}

        <Suspense fallback={null}>
          <StairCharacter
            scrollYProgress={scrollYProgress}
            sectionRefs={sectionRefs}
          />
        </Suspense>
      </div>

      <TimelineOutro />
    </motion.div>
  );
}
