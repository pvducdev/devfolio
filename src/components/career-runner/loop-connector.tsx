import { RUNNER_CONFIG } from "@/config/career-timeline";

export function LoopConnector() {
  return (
    <div
      className="relative flex shrink-0 items-end justify-center pb-8"
      style={{ width: RUNNER_CONFIG.sectionWidth / 2 }}
    >
      {/* Pixel art sign post */}
      <div className="flex flex-col items-center">
        {/* Sign */}
        <div className="border border-foreground bg-background px-4 py-2 font-mono text-sm">
          <span className="text-foreground/60">{">"}</span> while(true)
        </div>
        {/* Post */}
        <div className="h-8 w-0.5 bg-foreground" />
      </div>
    </div>
  );
}
