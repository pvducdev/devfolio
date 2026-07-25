import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import {
  page_career_heading,
  page_career_hint_scroll,
  page_career_intro,
  page_career_introsub,
} from "@/paraglide/messages.js";

import { containerVariants, itemVariants } from "./motion-variants";

export default function TimelineIntro() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  const animationProps = prefersReducedMotion
    ? { animate: "visible", initial: "visible" }
    : { animate: "visible", initial: "hidden", variants: containerVariants };

  return (
    <motion.div {...animationProps} className="px-4 py-10 font-mono">
      <motion.h1
        className="mb-1 text-foreground text-sm uppercase tracking-wide"
        {...(!prefersReducedMotion && { variants: itemVariants })}
      >
        {page_career_heading()}
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
      </motion.h1>

      <motion.div
        className="mb-6 h-0.5 w-24 bg-linear-to-r from-primary to-transparent"
        style={{ transformOrigin: "left" }}
        {...(!prefersReducedMotion && {
          animate: { scaleX: 1 },
          initial: { scaleX: 0 },
          transition: {
            delay: 0.3,
            duration: 0.8,
            ease: [0.25, 1, 0.5, 1],
          },
        })}
      />

      <motion.p
        className="mb-1 text-muted-foreground text-xs leading-relaxed"
        {...(!prefersReducedMotion && { variants: itemVariants })}
      >
        {page_career_intro()}
      </motion.p>
      <motion.p
        className="mb-6 text-muted-foreground text-xs leading-relaxed"
        {...(!prefersReducedMotion && { variants: itemVariants })}
      >
        {page_career_introsub()}
      </motion.p>

      <motion.p
        className="mb-4 text-center text-[10px] text-muted-foreground tracking-wide"
        {...(!prefersReducedMotion && { variants: itemVariants })}
      >
        {page_career_hint_scroll()}
      </motion.p>

      <motion.div
        className="flex justify-center"
        {...(!prefersReducedMotion && { variants: itemVariants })}
      >
        <motion.div
          {...(!prefersReducedMotion && {
            animate: { y: [0, 4, 0] },
            transition: {
              duration: 2.5,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            },
          })}
        >
          <ChevronDown className="size-4 text-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
