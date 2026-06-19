import { motion, useReducedMotion } from "motion/react";

import {
  page_career_complete,
  page_career_eof,
  page_career_thanks,
} from "@/paraglide/messages.js";

import { containerVariants, itemVariants } from "./motion-variants";

export default function TimelineOutro() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      className="px-4 py-10 font-mono"
      initial="hidden"
      viewport={{ amount: 0.5, once: true }}
      whileInView="visible"
      {...(!prefersReducedMotion && { variants: containerVariants })}
    >
      <motion.h2
        className="mb-1 text-foreground text-sm uppercase tracking-wide"
        {...(!prefersReducedMotion && { variants: itemVariants })}
      >
        {page_career_eof()}
        {prefersReducedMotion ? null : (
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
        )}
      </motion.h2>

      <motion.div
        className="mb-6 h-0.5 w-24 bg-linear-to-r from-primary to-transparent"
        style={{ transformOrigin: "left" }}
        {...(!prefersReducedMotion && {
          initial: { scaleX: 0 },
          transition: {
            delay: 0.3,
            duration: 0.8,
            ease: [0.25, 1, 0.5, 1],
          },
          viewport: { once: true },
          whileInView: { scaleX: 1 },
        })}
      />

      <motion.p
        className="mb-1 text-muted-foreground text-xs leading-relaxed"
        {...(!prefersReducedMotion && { variants: itemVariants })}
      >
        {page_career_complete()}
      </motion.p>
      <motion.p
        className="text-muted-foreground text-xs leading-relaxed"
        {...(!prefersReducedMotion && { variants: itemVariants })}
      >
        {page_career_thanks()}
      </motion.p>
    </motion.div>
  );
}
