import { motion } from "motion/react";
import { useShallow } from "zustand/react/shallow";
import {
  CAREER_BACKGROUND_CONFIG,
  MILESTONE_ANIMATION_CONFIG,
} from "@/config/career-timeline";
import { cn } from "@/lib/utils.ts";
import { useMilestoneStore } from "@/store/milestone";

export default function BackgroundContainer() {
  const isInMilestoneZone = useMilestoneStore(
    useShallow((s) => s.isInMilestoneZone)
  );

  return (
    <motion.div
      animate={{
        opacity: isInMilestoneZone
          ? MILESTONE_ANIMATION_CONFIG.dimmedOpacity
          : 1,
        filter: isInMilestoneZone ? "brightness(0.7)" : "brightness(1)",
      }}
      className={cn(
        "pointer-events-none absolute inset-0 bg-center bg-cover",
        CAREER_BACKGROUND_CONFIG.fallbackColor
      )}
      style={{
        backgroundImage: `url(${CAREER_BACKGROUND_CONFIG.src})`,
        willChange: "opacity, filter",
      }}
      transition={{
        duration: MILESTONE_ANIMATION_CONFIG.spotlightDim,
        ease: MILESTONE_ANIMATION_CONFIG.easing,
      }}
    />
  );
}
