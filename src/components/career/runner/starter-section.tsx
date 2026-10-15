import { ChevronDown } from "lucide-react";
import type { Variants } from "motion/react";
import { motion, stagger } from "motion/react";

import {
  page_career_heading,
  page_career_hint_scroll,
  page_career_intro,
  page_career_introsub,
} from "@/paraglide/messages.js";

import { BlinkingCursor, UNDERLINE_TRANSITION } from "../blinking-cursor";

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
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1],
    },
    x: 0,
  },
};

const TitleSection = () => (
  <div className="mb-12">
    <motion.h1
      className="mb-1 text-foreground text-xl uppercase tracking-wide"
      variants={itemVariants}
    >
      {page_career_heading()}
      <BlinkingCursor />
    </motion.h1>
    <motion.div
      className="h-0.5 w-32 bg-linear-to-r from-primary to-transparent"
      style={{ transformOrigin: "left" }}
      animate={{ scaleX: 1 }}
      initial={{ scaleX: 0 }}
      transition={UNDERLINE_TRANSITION}
    />
  </div>
);

const StarterSection = () => (
  <motion.div
    animate="visible"
    initial="hidden"
    variants={containerVariants}
    aria-label="Career timeline introduction"
    className="flex h-full w-96 shrink-0 flex-col justify-center px-8 py-12 font-mono"
    role="region"
  >
    <TitleSection />

    <motion.p
      className="mb-8 text-muted-foreground text-xs leading-relaxed"
      variants={itemVariants}
    >
      {page_career_intro()}
      <br />
      {page_career_introsub()}
    </motion.p>

    <motion.p
      className="mb-6 text-center text-muted-foreground text-xs tracking-wide"
      variants={itemVariants}
    >
      {page_career_hint_scroll()}
    </motion.p>

    <motion.div className="flex justify-center" variants={itemVariants}>
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <ChevronDown className="size-4 text-muted-foreground/50" />
      </motion.div>
    </motion.div>
  </motion.div>
);

export default StarterSection;
