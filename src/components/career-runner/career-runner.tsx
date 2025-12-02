import { useMotionValue, useMotionValueEvent } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CAREER_SECTIONS,
  type CareerSection,
  RUNNER_CONFIG,
} from "@/config/career-timeline";
import { Character } from "./character";
import { Ground } from "./ground";
import { JobCard } from "./job-card";
import { Landmark } from "./landmark";
import { LoopConnector } from "./loop-connector";
import { Section } from "./section";
import { StarryBackground } from "./starry-background";
import { YearHUD } from "./year-hud";

export function CareerRunner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState<CareerSection>(
    CAREER_SECTIONS[0]
  );
  const scrollX = useMotionValue(0);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Handle wheel -> horizontal scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
      scrollX.set(container.scrollLeft);

      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [scrollX]);

  // Update current section based on scroll position
  useMotionValueEvent(scrollX, "change", (latest) => {
    const sectionIndex = Math.floor(latest / RUNNER_CONFIG.sectionWidth);
    const clampedIndex = Math.min(
      Math.max(0, sectionIndex),
      CAREER_SECTIONS.length - 1
    );
    const section = CAREER_SECTIONS[clampedIndex];
    if (section && section.id !== currentSection.id) {
      setCurrentSection(section);
    }
  });

  // Infinite loop logic
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const maxScroll = container.scrollWidth - container.clientWidth;

    if (container.scrollLeft >= maxScroll * 0.98) {
      container.scrollTo({ left: 0, behavior: "instant" });
      scrollX.set(0);
    }
  }, [scrollX]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="relative h-full min-h-[400px] w-full overflow-hidden bg-background font-mono">
      {/* Starry background */}
      <StarryBackground starCount={40} />

      {/* Year HUD */}
      <YearHUD year={currentSection.year} />

      {/* Character (fixed position on ground) */}
      <div
        className="absolute z-10"
        style={{
          left: RUNNER_CONFIG.characterPosition.left,
          bottom: RUNNER_CONFIG.characterPosition.bottom,
        }}
      >
        <Character isRunning={isScrolling} />
      </div>

      {/* Scrollable timeline */}
      <section
        aria-label="Career timeline"
        className="scrollbar-none flex h-full overflow-x-auto"
        ref={containerRef}
      >
        {/* Spacer for character */}
        <div className="shrink-0" style={{ width: 140 }} />

        {/* Sections */}
        {CAREER_SECTIONS.map((section, index) => (
          <Section key={section.id}>
            {/* Card - positioned at top */}
            <div
              className="-translate-x-1/2 absolute left-1/2"
              style={{ top: RUNNER_CONFIG.cardTop }}
            >
              <JobCard
                details={section.card.details}
                isCurrent={index === CAREER_SECTIONS.length - 1}
                style={section.card.style}
                subtitle={section.card.subtitle}
                title={section.card.title}
              />
            </div>

            {/* Connector line from card to landmark */}
            <div
              className="-translate-x-1/2 absolute left-1/2 h-full w-px bg-foreground/20"
              style={{
                top: RUNNER_CONFIG.cardTop + 160,
                bottom: RUNNER_CONFIG.landmarkBottom + 30,
              }}
            />

            {/* Landmark - positioned on ground */}
            <div
              className="-translate-x-1/2 absolute left-1/2"
              style={{ bottom: RUNNER_CONFIG.landmarkBottom }}
            >
              <Landmark type={section.landmark} />
            </div>
          </Section>
        ))}

        {/* Loop connector */}
        <LoopConnector />

        {/* Extra space for smooth looping */}
        <div className="shrink-0" style={{ width: 200 }} />
      </section>

      {/* Ground - always visible at bottom */}
      <Ground />
    </div>
  );
}
