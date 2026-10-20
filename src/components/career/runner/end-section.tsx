import type { Variants } from "motion/react";
import { motion, stagger } from "motion/react";

import {
  page_career_aria_end,
  page_career_complete,
  page_career_eof,
  page_career_thanks,
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
  hidden: { opacity: 0, x: 20 },
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
      {page_career_eof()}
      <BlinkingCursor />
    </motion.h1>
    <motion.div
      className="h-0.5 w-32 bg-gradient-to-l from-primary to-transparent"
      style={{ transformOrigin: "right" }}
      animate={{ scaleX: 1 }}
      initial={{ scaleX: 0 }}
      transition={UNDERLINE_TRANSITION}
    />
  </div>
);

const EndSection = () => (
  <motion.div
    animate="visible"
    initial="hidden"
    variants={containerVariants}
    aria-label={page_career_aria_end()}
    className="flex h-full w-96 shrink-0 flex-col items-end justify-center px-8 py-12 font-mono"
    role="region"
  >
    <TitleSection />

    <motion.p
      className="mb-8 text-right text-muted-foreground text-xs leading-relaxed"
      variants={itemVariants}
    >
      {page_career_complete()}
      <br />
      {page_career_thanks()}
    </motion.p>
  </motion.div>
);

export default EndSection;
