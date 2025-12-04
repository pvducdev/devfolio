import { motion } from "motion/react";
import { useShallow } from "zustand/react/shallow";
import { CAREER_BACKGROUND_CONFIG } from "@/config/career-timeline";
import { cn } from "@/lib/utils.ts";
import { useMilestoneStore } from "@/store/milestone";

export default function BackgroundContainer() {
  const isInMilestoneZone = useMilestoneStore(
    useShallow((s) => s.isInMilestoneZone)
  );

  return (
    <motion.div
      animate={{
        opacity: isInMilestoneZone ? 0.6 : 1,
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
        duration: 0.4,
        ease: [0.25, 1, 0.5, 1],
      }}
    />
  );
}
