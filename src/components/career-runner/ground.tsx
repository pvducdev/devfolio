import { motion } from "motion/react";
import { useMemo } from "react";
import { MILESTONE_ANIMATION_CONFIG } from "@/config/career-timeline";
import { useMilestoneStore } from "@/store/milestone";

export function Ground() {
  const isInMilestoneZone = useMilestoneStore((s) => s.isInMilestoneZone);
  const activeJobType = useMilestoneStore((s) => s.activeJobType);

  const glowColor = activeJobType
    ? MILESTONE_ANIMATION_CONFIG.glowColors[activeJobType]
    : MILESTONE_ANIMATION_CONFIG.glowColors.fulltime;

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
      <motion.div
        animate={{
          backgroundColor: isInMilestoneZone ? glowColor : "transparent",
          boxShadow: isInMilestoneZone
            ? `0 0 10px 2px ${glowColor}, 0 0 20px 4px ${glowColor.replace("0.6)", "0.3)")}`
            : "0 0 0 0 transparent",
        }}
        className="-translate-x-1/2 absolute bottom-0 left-1/2 h-1 w-20 rounded-full"
        transition={{
          duration: MILESTONE_ANIMATION_CONFIG.groundPulse,
          ease: MILESTONE_ANIMATION_CONFIG.easing,
        }}
      />

      <div className="h-px w-full bg-foreground" />

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
