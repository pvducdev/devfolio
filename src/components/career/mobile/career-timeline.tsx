import { motion, useScroll, useTransform } from "motion/react";
import { lazy, Suspense, useRef } from "react";
import { CAREER_SECTIONS } from "@/components/career-runner/config";
import { useCareerTimeline } from "@/hooks/use-career-timeline";
import CareerEntry from "./career-entry";
import TimelineIntro from "./timeline-intro";
import TimelineOutro from "./timeline-outro";

const StairCharacter = lazy(() => import("./stair-character"));

export default function CareerTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { sectionRefs, activeIndex } = useCareerTimeline(scrollRef);

  const { scrollYProgress } = useScroll({ container: scrollRef });
  const lineProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="relative h-full overflow-y-auto" ref={scrollRef}>
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
            section={section}
          />
        ))}

        <Suspense fallback={null}>
          <StairCharacter activeIndex={activeIndex} sectionRefs={sectionRefs} />
        </Suspense>
      </div>

      <TimelineOutro />
    </div>
  );
}
