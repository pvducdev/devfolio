import {
  CAREER_SECTIONS,
  INFINITE_SCROLL_CONFIG,
} from "@/config/career-timeline";
import BackgroundContainer from "./background-container.tsx";
import { CareerSectionContent } from "./career-section";
import { Character } from "./character";
import { Ground } from "./ground";
import { useInfiniteScroll } from "./hooks/use-infinite-scroll";
import { useMilestoneDetection } from "./hooks/use-milestone-detection";
import { useWheelScroll } from "./hooks/use-wheel-scroll";
import { LoopConnector } from "./loop-connector";
import { YearHUD } from "./year-hud";

const ALIGNMENT_TOLERANCE = 250;

export function CareerRunner() {
  const { containerRef, scrollX } = useInfiniteScroll({
    teleportDebounceMs: INFINITE_SCROLL_CONFIG.teleportDebounceMs,
  });

  const { currentSection, activeSectionId } = useMilestoneDetection(scrollX, {
    alignmentTolerance: ALIGNMENT_TOLERANCE,
    containerRef,
  });

  const { isScrolling } = useWheelScroll(containerRef, scrollX);

  return (
    <div className="scrollbar-none relative h-full min-h-100 w-full overflow-hidden bg-background font-mono">
      <BackgroundContainer />
      <YearHUD year={currentSection.year} />

      <div className="-translate-x-1/2 -bottom-2 absolute left-1/2 z-10">
        <Character isRunning={isScrolling} />
      </div>

      <section
        aria-label="Career timeline"
        className="scrollbar-none flex h-full overflow-x-auto"
        ref={containerRef}
      >
        {CAREER_SECTIONS.slice(
          -INFINITE_SCROLL_CONFIG.leadingCloneSections
        ).map((section, cloneIdx) => {
          const originalIndex =
            CAREER_SECTIONS.length -
            INFINITE_SCROLL_CONFIG.leadingCloneSections +
            cloneIdx;
          return (
            <CareerSectionContent
              isActive={activeSectionId === section.id}
              isCurrent={originalIndex === CAREER_SECTIONS.length - 1}
              key={`clone-leading-${section.id}`}
              section={section}
            />
          );
        })}
        <LoopConnector />
        <div className="w-36 shrink-0" />

        <div className="w-36 shrink-0" />
        {CAREER_SECTIONS.map((section, index) => (
          <CareerSectionContent
            isActive={activeSectionId === section.id}
            isCurrent={index === CAREER_SECTIONS.length - 1}
            key={section.id}
            section={section}
          />
        ))}
        <LoopConnector />
        <div className="w-52 shrink-0" />

        <div className="w-36 shrink-0" />
        {CAREER_SECTIONS.slice(
          0,
          INFINITE_SCROLL_CONFIG.trailingCloneSections
        ).map((section) => (
          <CareerSectionContent
            isActive={activeSectionId === section.id}
            isCurrent={false}
            key={`clone-trailing-${section.id}`}
            section={section}
          />
        ))}
      </section>

      <Ground />
    </div>
  );
}
