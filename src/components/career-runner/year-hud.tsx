import { AnimatePresence, motion } from "motion/react";

import { page_career_label_year } from "@/paraglide/messages.js";
import { useDisplayYear } from "@/store/career";

export default function YearHUD() {
  const year = useDisplayYear();
  const digits = [...year];

  return (
    <div className="absolute top-4 right-4 z-50">
      <div className="border border-foreground bg-background px-3 py-1.5 font-mono">
        <div className="mb-0.5 text-foreground/50 text-xs">
          {page_career_label_year()}
        </div>
        <div className="flex overflow-hidden font-bold text-lg">
          <AnimatePresence mode="popLayout">
            {digits.map((digit, index) => (
              <motion.span
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                className="inline-block tabular-nums tracking-wider"
                exit={{ opacity: 0, rotateX: 90, y: 30 }}
                initial={{ opacity: 0, rotateX: -90, y: -30 }}
                key={`${index}-${digit}`}
                style={{
                  perspective: 100,
                  transformOrigin: "center center",
                }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
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
