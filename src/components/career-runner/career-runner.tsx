import { LayoutGroup } from "motion/react";
import { CAREER_SECTIONS, UI_CONFIG } from "@/config/career-timeline";
import { useCareerScroll } from "@/hooks/use-career-scroll";
import { cn } from "@/lib/utils.ts";
import CareerSection from "./career-section";
import Character from "./character";
import EndSection from "./end-section";
import Ground from "./ground";
import StarterSection from "./starter-section";
import YearHUD from "./year-hud";

export default function CareerRunner() {
  const { containerRef } = useCareerScroll();

  return (
    <div className="relative size-full overflow-hidden bg-background font-mono">
      <YearHUD />

      <div className="-translate-x-1/2 -bottom-2 absolute left-1/2 z-10">
        <Character />
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

        <LayoutGroup>
          {CAREER_SECTIONS.map((section) => (
            <CareerSection
              containerRef={containerRef}
              key={section.id}
              section={section}
            />
          ))}
        </LayoutGroup>

        <EndSection />

        <div className="sr-only" />
      </section>

      <Ground />
    </div>
  );
}
