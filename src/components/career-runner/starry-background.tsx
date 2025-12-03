import { motion } from "motion/react";
import { useMemo } from "react";
import { MILESTONE_ANIMATION_CONFIG } from "@/config/career-timeline";
import { useMilestoneStore } from "@/store/milestone";

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDelay: number;
};

type StarryBackgroundProps = {
  starCount?: number;
};

export function StarryBackground({ starCount = 50 }: StarryBackgroundProps) {
  const isInMilestoneZone = useMilestoneStore((s) => s.isInMilestoneZone);

  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60, // Only top 60% of the screen
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      animationDelay: Math.random() * 3,
    }));
  }, [starCount]);

  return (
    <motion.div
      animate={{
        opacity: isInMilestoneZone
          ? MILESTONE_ANIMATION_CONFIG.dimmedOpacity
          : 1,
        filter: isInMilestoneZone ? "brightness(0.4)" : "brightness(1)",
      }}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ willChange: "opacity, filter" }}
      transition={{
        duration: MILESTONE_ANIMATION_CONFIG.spotlightDim,
        ease: MILESTONE_ANIMATION_CONFIG.easing,
      }}
    >
      {stars.map((star) => (
        <div
          className="absolute animate-pulse rounded-full bg-foreground/80"
          key={star.id}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: `${star.animationDelay}s`,
            animationDuration: "2s",
          }}
        />
      ))}
    </motion.div>
  );
}
