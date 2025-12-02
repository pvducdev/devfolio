import { AnimatePresence, motion } from "motion/react";

type YearHUDProps = {
  year: string;
};

export function YearHUD({ year }: YearHUDProps) {
  return (
    <div className="absolute top-4 right-4 z-50">
      {/* Retro pixel-style HUD */}
      <div className="border border-foreground bg-background px-3 py-1.5 font-mono">
        <div className="mb-0.5 text-foreground/50 text-xs">YEAR</div>
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="font-bold text-lg tabular-nums tracking-wider"
            exit={{ opacity: 0, y: 5 }}
            initial={{ opacity: 0, y: -5 }}
            key={year}
            transition={{ duration: 0.2 }}
          >
            {year}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
