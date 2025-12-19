import { LayoutGroup } from "motion/react";
import RunnerContainer from "@/components/career-runner/runner-container.tsx";
import { CAREER_SECTIONS } from "@/components/career-timeline/config";
import CareerSection from "./career-section";
import Character from "./character";
import EndSection from "./end-section";
import Ground from "./ground";
import StarterSection from "./starter-section";
import YearHUD from "./year-hud";

export default function CareerRunner() {
  return (
    <div className="relative size-full overflow-hidden bg-background font-mono">
      <YearHUD />

      <div className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2">
        <Character />
      </div>

      <RunnerContainer>
        <StarterSection />
        <LayoutGroup>
          {CAREER_SECTIONS.map((section) => (
            <CareerSection key={section.id} section={section} />
          ))}
        </LayoutGroup>
        <EndSection />
        <div className="sr-only" />
      </RunnerContainer>

      <Ground />
    </div>
  );
}
