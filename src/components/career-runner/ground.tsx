import { motion } from "motion/react";
import { useMemo } from "react";
import {
  CHARACTER_CONFIG,
  MILESTONE_ANIMATION_CONFIG,
  RUNNER_CONFIG,
} from "@/config/career-timeline";
import { useMilestoneStore } from "@/store/milestone";

export function Ground() {
  const isInMilestoneZone = useMilestoneStore((s) => s.isInMilestoneZone);

  // Generate stable ground texture on mount
  const bumps = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: `bump-${i}`,
        width: Math.random() * 20 + 5,
        marginLeft: Math.random() * 30,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-20">
      {/* Neon pulse segment - positioned under character */}
      <motion.div
        animate={{
          backgroundColor: isInMilestoneZone
            ? "rgb(34, 197, 94)"
            : "transparent",
          boxShadow: isInMilestoneZone
            ? "0 0 10px 2px rgba(34, 197, 94, 0.8), 0 0 20px 4px rgba(34, 197, 94, 0.4)"
            : "0 0 0 0 transparent",
        }}
        className="absolute h-1 rounded-full"
        style={{
          left: RUNNER_CONFIG.characterPosition.left - 10,
          width: CHARACTER_CONFIG.size.width + 20,
          bottom: 0,
        }}
        transition={{
          duration: MILESTONE_ANIMATION_CONFIG.groundPulse,
          ease: MILESTONE_ANIMATION_CONFIG.easing,
        }}
      />

      {/* Main ground line */}
      <div className="h-px w-full bg-foreground" />

      {/* Ground texture - small bumps like Dino game */}
      <div className="flex h-2 w-full items-start gap-8 overflow-hidden pt-0.5">
        {bumps.map((bump) => (
          <div
            className="h-0.5 shrink-0 bg-foreground/60"
            key={bump.id}
            style={{
              width: bump.width,
              marginLeft: bump.marginLeft,
            }}
          />
        ))}
      </div>
    </div>
  );
}
