import type { LandmarkType } from "@/config/career-timeline";
import { cn } from "@/lib/utils";
import { LANDMARK_REGISTRY } from "./registries/landmarks";

type LandmarkProps = {
  type: LandmarkType;
  className?: string;
};

export function Landmark({ type, className }: LandmarkProps) {
  const LandmarkComponent = LANDMARK_REGISTRY[type];

  return (
    <div className={cn("flex items-end", className)}>
      <LandmarkComponent />
    </div>
  );
}
