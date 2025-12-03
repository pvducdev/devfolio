import { useMotionValue, useMotionValueEvent } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CAREER_SECTIONS,
  type CareerSection,
  INFINITE_SCROLL_CONFIG,
  RUNNER_CONFIG,
} from "@/config/career-timeline";
import { useMilestoneStore } from "@/store/milestone";
import { Character } from "./character";
import { Ground } from "./ground";
import {
  calculateSectionIndex,
  getRealContentStartPos,
  normalizeScrollPosition,
} from "./infinite-scroll-utils";
import { JobCard } from "./job-card";
import { Landmark } from "./landmark";
import { LoopConnector } from "./loop-connector";
import { Section } from "./section";
import { StarryBackground } from "./starry-background";
import { YearHUD } from "./year-hud";

/**
 * Constants for milestone alignment calculation.
 *
 * Math:
 * - Character position: 60px from left
 * - Spacer: 140px
 * - Section width: 1000px
 * - Landmark at center of section: 500px from section start
 *
 * For section N: landmark is at (140 + N * 1000 + 500) = 640 + N * 1000
 * When scrollLeft = X, landmark appears at: (640 + N * 1000) - X
 * For alignment with character at 60px: X = 580 + N * 1000
 */
const SPACER_WIDTH = 140;
const LANDMARK_OFFSET = RUNNER_CONFIG.sectionWidth / 2; // 500px (center of section)
const CHARACTER_LEFT = RUNNER_CONFIG.characterPosition.left; // 60px
const ALIGNMENT_TOLERANCE = 250; // px tolerance for "active" zone

export function CareerRunner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState<CareerSection>(
    CAREER_SECTIONS[0]
  );
  const scrollX = useMotionValue(0);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // Refs for infinite scroll teleport logic
  const teleportLockRef = useRef(false);
  const lastTeleportTimeRef = useRef(0);

  // Milestone store for animation state
  const activeSectionId = useMilestoneStore((s) => s.activeSectionId);
  const setActiveSection = useMilestoneStore((s) => s.setActiveSection);
  const setMilestoneZone = useMilestoneStore((s) => s.setMilestoneZone);
  const resetMilestone = useMilestoneStore((s) => s.reset);

  // Cleanup milestone store on unmount
  useEffect(() => () => resetMilestone(), [resetMilestone]);

  const calculateActiveSection = useCallback(
    (scrollLeft: number) => {
      // Use normalized scroll for milestone detection (works in both real and clone zones)
      const { normalizedScroll } = normalizeScrollPosition(scrollLeft);

      // For each section, check if its landmark is within tolerance of character position
      for (let i = 0; i < CAREER_SECTIONS.length; i++) {
        // Position where this section's landmark aligns with character
        const alignmentScrollPos =
          SPACER_WIDTH +
          i * RUNNER_CONFIG.sectionWidth +
          LANDMARK_OFFSET -
          CHARACTER_LEFT;

        // Check if normalized scroll is within tolerance of alignment position
        if (
          Math.abs(normalizedScroll - alignmentScrollPos) <= ALIGNMENT_TOLERANCE
        ) {
          const section = CAREER_SECTIONS[i];
          if (section && activeSectionId !== section.id) {
            setActiveSection(section.id, section.jobType);
            setMilestoneZone(true);
          }
          return;
        }
      }

      // No section is aligned - exit milestone zone
      if (activeSectionId !== null) {
        setMilestoneZone(false);
        setActiveSection(null, null);
      }
    },
    [activeSectionId, setActiveSection, setMilestoneZone]
  );

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

  // Update current section and active milestone based on scroll position
  useMotionValueEvent(scrollX, "change", (latest) => {
    // Use calculateSectionIndex for correct year display (works in both real and clone zones)
    const sectionIndex = calculateSectionIndex(latest);
    const section = CAREER_SECTIONS[sectionIndex];
    if (section && section.id !== currentSection.id) {
      setCurrentSection(section);
    }

    // Update active milestone based on landmark alignment
    calculateActiveSection(latest);
  });

  // Bidirectional infinite loop with seamless teleport
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || teleportLockRef.current) {
      return;
    }

    const now = Date.now();
    if (
      now - lastTeleportTimeRef.current <
      INFINITE_SCROLL_CONFIG.teleportDebounceMs
    ) {
      return;
    }

    const { needsTeleport, teleportTo } = normalizeScrollPosition(
      container.scrollLeft
    );

    if (needsTeleport && teleportTo !== null) {
      teleportLockRef.current = true;
      lastTeleportTimeRef.current = now;

      // Use requestAnimationFrame for smooth teleport
      requestAnimationFrame(() => {
        container.scrollLeft = teleportTo;
        scrollX.set(teleportTo);

        // Release lock after next frame
        requestAnimationFrame(() => {
          teleportLockRef.current = false;
        });
      });
    }
  }, [scrollX]);

  // Initialize scroll position to start of real content zone
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const startPos = getRealContentStartPos();
    container.scrollLeft = startPos;
    scrollX.set(startPos);
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

      {/* Scrollable timeline with cloned content for seamless infinite loop */}
      <section
        aria-label="Career timeline"
        className="scrollbar-none flex h-full overflow-x-auto"
        ref={containerRef}
      >
        {/* === LEADING CLONE ZONE === */}
        {/* Clone of last N sections for seamless backward scrolling */}
        {CAREER_SECTIONS.slice(
          -INFINITE_SCROLL_CONFIG.leadingCloneSections
        ).map((section, cloneIdx) => {
          const originalIndex =
            CAREER_SECTIONS.length -
            INFINITE_SCROLL_CONFIG.leadingCloneSections +
            cloneIdx;
          return (
            <Section key={`clone-leading-${section.id}`}>
              <div
                className="-translate-x-1/2 absolute left-1/2"
                style={{ top: RUNNER_CONFIG.cardTop }}
              >
                <JobCard
                  details={section.card.details}
                  isActive={activeSectionId === section.id}
                  isCurrent={originalIndex === CAREER_SECTIONS.length - 1}
                  jobType={section.jobType}
                  style={section.card.style}
                  subtitle={section.card.subtitle}
                  title={section.card.title}
                />
              </div>
              <div
                className="-translate-x-1/2 absolute left-1/2 h-full w-px bg-foreground/20"
                style={{
                  top: RUNNER_CONFIG.cardTop + 160,
                  bottom: RUNNER_CONFIG.landmarkBottom + 30,
                }}
              />
              <div
                className="-translate-x-1/2 absolute left-1/2"
                style={{ bottom: RUNNER_CONFIG.landmarkBottom }}
              >
                <Landmark type={section.landmark} />
              </div>
            </Section>
          );
        })}

        {/* Clone of LoopConnector */}
        <LoopConnector />

        {/* Clone of spacer */}
        <div className="shrink-0" style={{ width: 140 }} />

        {/* === REAL CONTENT ZONE === */}
        {/* Spacer for character */}
        <div className="shrink-0" style={{ width: 140 }} />

        {/* Real Sections */}
        {CAREER_SECTIONS.map((section, index) => (
          <Section key={section.id}>
            <div
              className="-translate-x-1/2 absolute left-1/2"
              style={{ top: RUNNER_CONFIG.cardTop }}
            >
              <JobCard
                details={section.card.details}
                isActive={activeSectionId === section.id}
                isCurrent={index === CAREER_SECTIONS.length - 1}
                jobType={section.jobType}
                style={section.card.style}
                subtitle={section.card.subtitle}
                title={section.card.title}
              />
            </div>
            <div
              className="-translate-x-1/2 absolute left-1/2 h-full w-px bg-foreground/20"
              style={{
                top: RUNNER_CONFIG.cardTop + 160,
                bottom: RUNNER_CONFIG.landmarkBottom + 30,
              }}
            />
            <div
              className="-translate-x-1/2 absolute left-1/2"
              style={{ bottom: RUNNER_CONFIG.landmarkBottom }}
            >
              <Landmark type={section.landmark} />
            </div>
          </Section>
        ))}

        {/* Real Loop connector (with while(true) sign) */}
        <LoopConnector />

        {/* Real extra space */}
        <div className="shrink-0" style={{ width: 200 }} />

        {/* === TRAILING CLONE ZONE === */}
        {/* Clone of spacer */}
        <div className="shrink-0" style={{ width: 140 }} />

        {/* Clone of first N sections for seamless forward scrolling */}
        {CAREER_SECTIONS.slice(
          0,
          INFINITE_SCROLL_CONFIG.trailingCloneSections
        ).map((section) => (
          <Section key={`clone-trailing-${section.id}`}>
            <div
              className="-translate-x-1/2 absolute left-1/2"
              style={{ top: RUNNER_CONFIG.cardTop }}
            >
              <JobCard
                details={section.card.details}
                isActive={activeSectionId === section.id}
                isCurrent={false}
                jobType={section.jobType}
                style={section.card.style}
                subtitle={section.card.subtitle}
                title={section.card.title}
              />
            </div>
            <div
              className="-translate-x-1/2 absolute left-1/2 h-full w-px bg-foreground/20"
              style={{
                top: RUNNER_CONFIG.cardTop + 160,
                bottom: RUNNER_CONFIG.landmarkBottom + 30,
              }}
            />
            <div
              className="-translate-x-1/2 absolute left-1/2"
              style={{ bottom: RUNNER_CONFIG.landmarkBottom }}
            >
              <Landmark type={section.landmark} />
            </div>
          </Section>
        ))}
      </section>

      {/* Ground - always visible at bottom */}
      <Ground />
    </div>
  );
}
