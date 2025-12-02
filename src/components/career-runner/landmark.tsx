import type { LandmarkType } from "@/config/career-timeline";
import { cn } from "@/lib/utils";

type LandmarkProps = {
  type: LandmarkType;
  className?: string;
};

export function Landmark({ type, className }: LandmarkProps) {
  return (
    <div className={cn("flex items-end", className)}>
      {type === "university" && <UniversityLandmark />}
      {type === "cafe" && <CafeLandmark />}
      {type === "coworking" && <CoworkingLandmark />}
      {type === "office" && <OfficeLandmark />}
      {type === "tech-station" && <TechStationLandmark />}
    </div>
  );
}

// Pixel art style landmarks - Dino game cactus-inspired
function UniversityLandmark() {
  return (
    <div className="flex flex-col items-center">
      {/* Flag */}
      <div className="mb-0.5 h-3 w-4 bg-foreground" />
      {/* Pole */}
      <div className="h-8 w-0.5 bg-foreground" />
      {/* Building */}
      <div className="flex items-end gap-px">
        <div className="h-6 w-2 bg-foreground" />
        <div className="h-10 w-3 bg-foreground" />
        <div className="h-6 w-2 bg-foreground" />
      </div>
    </div>
  );
}

function CafeLandmark() {
  return (
    <div className="flex flex-col items-center">
      {/* Steam */}
      <div className="mb-1 flex gap-1">
        <div className="h-2 w-0.5 bg-foreground/50" />
        <div className="h-3 w-0.5 bg-foreground/50" />
      </div>
      {/* Cup */}
      <div className="h-4 w-5 rounded-b bg-foreground" />
      {/* Table */}
      <div className="mt-1 h-0.5 w-8 bg-foreground" />
      <div className="h-4 w-0.5 bg-foreground" />
    </div>
  );
}

function CoworkingLandmark() {
  return (
    <div className="flex items-end gap-1">
      {/* Monitor 1 */}
      <div className="flex flex-col items-center">
        <div className="h-4 w-5 border border-foreground" />
        <div className="h-2 w-0.5 bg-foreground" />
        <div className="h-0.5 w-3 bg-foreground" />
      </div>
      {/* Monitor 2 */}
      <div className="flex flex-col items-center">
        <div className="h-4 w-5 border border-foreground" />
        <div className="h-2 w-0.5 bg-foreground" />
        <div className="h-0.5 w-3 bg-foreground" />
      </div>
    </div>
  );
}

const OFFICE_WINDOWS = ["w1", "w2", "w3", "w4", "w5", "w6"] as const;

function OfficeLandmark() {
  return (
    <div className="flex flex-col items-center">
      {/* Building */}
      <div className="relative h-16 w-8 bg-foreground">
        {/* Windows */}
        <div className="absolute top-1 left-1 grid grid-cols-2 gap-1">
          {OFFICE_WINDOWS.map((id) => (
            <div className="h-1.5 w-1.5 bg-background" key={id} />
          ))}
        </div>
        {/* Door */}
        <div className="-translate-x-1/2 absolute bottom-0 left-1/2 h-3 w-2 bg-background" />
      </div>
    </div>
  );
}

function TechStationLandmark() {
  return (
    <div className="flex flex-col items-center">
      {/* Antenna */}
      <div className="mb-1 flex items-end gap-0.5">
        <div className="h-1 w-1 rounded-full bg-foreground" />
        <div className="h-6 w-0.5 bg-foreground" />
        <div className="h-1 w-1 rounded-full bg-foreground" />
      </div>
      {/* Server/Station */}
      <div className="relative h-10 w-6 bg-foreground">
        {/* Lights */}
        <div className="absolute top-1 left-1 flex flex-col gap-1">
          <div className="h-1 w-1 rounded-full bg-green-400" />
          <div className="h-1 w-1 rounded-full bg-green-400" />
          <div className="h-1 w-1 rounded-full bg-yellow-400" />
        </div>
        {/* Vents */}
        <div className="absolute top-1 right-1 flex flex-col gap-0.5">
          <div className="h-px w-2 bg-background" />
          <div className="h-px w-2 bg-background" />
          <div className="h-px w-2 bg-background" />
        </div>
      </div>
    </div>
  );
}
