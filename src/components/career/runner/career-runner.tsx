import { LayoutGroup } from "motion/react";

import { CAREER_TIMELINE } from "@/config/career";

import CareerSection from "./career-section";
import Character from "./character";
import EndSection from "./end-section";
import Ground from "./ground";
import RunnerContainer from "./runner-container";
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
          {CAREER_TIMELINE.map((entry) => (
            <CareerSection entry={entry} key={entry.year} />
          ))}
        </LayoutGroup>
        <EndSection />
      </RunnerContainer>

      <Ground />
    </div>
  );
}
