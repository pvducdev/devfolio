import type { ReactNode } from "react";
import { RUNNER_CONFIG } from "@/config/career-timeline";

type SectionProps = {
  children: ReactNode;
};

export function Section({ children }: SectionProps) {
  return (
    <div
      className="relative flex shrink-0 items-end pb-8"
      style={{ width: RUNNER_CONFIG.sectionWidth }}
    >
      {children}
    </div>
  );
}
