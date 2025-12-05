import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useCareerLooping, useCareerStore } from "@/store/career.ts";

const DEFAULT_YEAR = "2001";

export function YearHUD() {
  const activeSection = useCareerStore((s) => s.activeSection);
  const careerLooping = useCareerLooping();
  const [year, setYear] = useState<string>(DEFAULT_YEAR);

  useEffect(() => {
    if (careerLooping) {
      setYear(DEFAULT_YEAR);
      return;
    }
    if (activeSection) {
      setYear(activeSection.year);
    }
  }, [activeSection, careerLooping]);

  const digits = year.split("");

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
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: [0.25, 1, 0.5, 1],
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
