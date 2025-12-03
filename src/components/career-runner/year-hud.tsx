import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import { MILESTONE_ANIMATION_CONFIG } from "@/config/career-timeline";

type YearHUDProps = {
  year: string;
};

export function YearHUD({ year }: YearHUDProps) {
  const digits = useMemo(() => year.split(""), [year]);

  return (
    <div className="absolute top-4 right-4 z-50">
      <div className="border border-foreground bg-background px-3 py-1.5 font-mono">
        <div className="mb-0.5 text-foreground/50 text-xs">YEAR</div>
        <div className="flex overflow-hidden font-bold text-lg">
          <AnimatePresence mode="popLayout">
            {digits.map((digit, index) => (
              <motion.span
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                className="inline-block tabular-nums tracking-wider"
                exit={{ y: 30, opacity: 0, rotateX: 90 }}
                initial={{ y: -30, opacity: 0, rotateX: -90 }}
                key={`${index}-${digit}`}
                style={{
                  transformOrigin: "center center",
                  perspective: 100,
                }}
                transition={{
                  duration: MILESTONE_ANIMATION_CONFIG.yearFlip,
                  delay: index * 0.05,
                  ease: MILESTONE_ANIMATION_CONFIG.easing,
                }}
              >
                {digit}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
