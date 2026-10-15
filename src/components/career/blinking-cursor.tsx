import { motion } from "motion/react";

export const UNDERLINE_TRANSITION = {
  delay: 0.3,
  duration: 0.8,
  ease: [0.25, 1, 0.5, 1],
} as const;

export const BlinkingCursor = () => (
  <motion.span
    animate={{ opacity: [1, 0] }}
    transition={{
      duration: 0.53,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
    }}
  >
    _
  </motion.span>
);
