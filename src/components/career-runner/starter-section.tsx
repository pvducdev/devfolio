import { ChevronDown } from "lucide-react";
import type { Variants } from "motion/react";
import { motion, stagger, useReducedMotion } from "motion/react";
import {
  hint_career_scroll,
  page_career_heading,
  page_career_intro,
  page_career_introsub,
} from "@/paraglide/messages.js";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.15, { startDelay: 0.2 }),
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

function TitleSection({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean;
}) {
  return (
    <div className="mb-12">
      <motion.h1
        className="mb-1 font-bold text-foreground text-xl uppercase tracking-wide"
        {...(!prefersReducedMotion && { variants: itemVariants })}
      >
        {page_career_heading()}
        {!prefersReducedMotion && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: 0.53,
            }}
          >
            _
          </motion.span>
        )}
      </motion.h1>
      <motion.div
        className="h-0.5 w-32 bg-linear-to-r from-primary to-transparent"
        style={{ transformOrigin: "left" }}
        {...(!prefersReducedMotion && {
          initial: { scaleX: 0 },
          animate: { scaleX: 1 },
          transition: {
            duration: 0.8,
            ease: [0.25, 1, 0.5, 1],
            delay: 0.3,
          },
        })}
      />
    </div>
  );
}

export default function StarterSection() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  const animationProps = prefersReducedMotion
    ? { initial: "visible", animate: "visible" }
    : { initial: "hidden", animate: "visible", variants: containerVariants };

  return (
    <motion.div
      {...animationProps}
      aria-label="Career timeline introduction"
      className="flex h-full w-96 shrink-0 flex-col justify-center px-8 py-12 font-mono"
      role="region"
    >
      <TitleSection prefersReducedMotion={prefersReducedMotion} />

      <motion.p
        className="mb-8 text-muted-foreground text-xs leading-relaxed"
        {...(!prefersReducedMotion && { variants: itemVariants })}
      >
        {page_career_intro()}
        <br />
        {page_career_introsub()}
      </motion.p>

      <motion.p
        className="mb-6 text-center text-[10px] text-muted-foreground tracking-wide"
        {...(!prefersReducedMotion && { variants: itemVariants })}
      >
        {hint_career_scroll()}
      </motion.p>

      <motion.div
        className="flex justify-center"
        {...(!prefersReducedMotion && { variants: itemVariants })}
      >
        <motion.div
          {...(!prefersReducedMotion && {
            animate: {
              y: [0, 4, 0],
            },
            transition: {
              repeat: Number.POSITIVE_INFINITY,
              duration: 2.5,
              ease: "easeInOut",
            },
          })}
        >
          <ChevronDown className="size-4 text-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
