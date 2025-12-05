import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { CAREER_SECTIONS, UI_CONFIG } from "@/config/career-timeline";
import { useCareerScroll } from "@/hooks/use-career-scroll";
import { cn } from "@/lib/utils.ts";
import { useCareerStore } from "@/store/career";
import { CareerSection } from "./career-section";
import { Character } from "./character";
import { Ground } from "./ground";
import { StarterSection } from "./starter-section";
import { YearHUD } from "./year-hud";

export function CareerRunner() {
  const { containerRef, isScrolling } = useCareerScroll();
  const activeSection = useCareerStore(useShallow((s) => s.activeSection));
  const prevSection = useRef<typeof activeSection>(null);

  useEffect(() => {
    if (activeSection) {
      prevSection.current = activeSection;
    }
  }, [activeSection]);

  return (
    <div className="relative size-full overflow-hidden bg-background font-mono">
      <YearHUD />

      <div className="-translate-x-1/2 -bottom-2 absolute left-1/2 z-10">
        <Character isRunning={isScrolling} />
      </div>

      <section
        aria-label="Career timeline"
        className={cn(
          "scrollbar-none flex h-full overflow-x-auto",
          UI_CONFIG.sectionSpace
        )}
        ref={containerRef}
      >
        <StarterSection />

        {CAREER_SECTIONS.map((section) => (
          <CareerSection key={section.id} section={section} />
        ))}
        <div className="w-52 shrink-0" />
      </section>

      <Ground />
    </div>
  );
}
