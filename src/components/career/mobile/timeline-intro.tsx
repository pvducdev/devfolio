import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";

import {
  page_career_heading,
  page_career_hint_scroll,
  page_career_intro,
  page_career_introsub,
} from "@/paraglide/messages.js";

import { BlinkingCursor, UNDERLINE_TRANSITION } from "../blinking-cursor";
import { containerVariants, itemVariants } from "./motion-variants";

export default function TimelineIntro() {
  return (
    <motion.div
      animate="visible"
      className="px-4 py-10 font-mono"
      initial="hidden"
      variants={containerVariants}
    >
      <motion.h1
        className="mb-1 text-foreground text-sm uppercase tracking-wide"
        variants={itemVariants}
      >
        {page_career_heading()}
        <BlinkingCursor />
      </motion.h1>

      <motion.div
        className="mb-6 h-0.5 w-24 bg-linear-to-r from-primary to-transparent"
        style={{ transformOrigin: "left" }}
        animate={{ scaleX: 1 }}
        initial={{ scaleX: 0 }}
        transition={UNDERLINE_TRANSITION}
      />

      <motion.p
        className="mb-1 text-muted-foreground text-xs leading-relaxed"
        variants={itemVariants}
      >
        {page_career_intro()}
      </motion.p>
      <motion.p
        className="mb-6 text-muted-foreground text-xs leading-relaxed"
        variants={itemVariants}
      >
        {page_career_introsub()}
      </motion.p>

      <motion.p
        className="mb-4 text-center text-[10px] text-muted-foreground tracking-wide"
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
}
