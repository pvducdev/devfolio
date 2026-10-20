import { motion } from "motion/react";

import {
  page_career_complete,
  page_career_eof,
  page_career_thanks,
} from "@/paraglide/messages.js";

import { BlinkingCursor, UNDERLINE_TRANSITION } from "../blinking-cursor";
import { containerVariants, itemVariants } from "./motion-variants";

export default function TimelineOutro() {
  return (
    <motion.div
      className="px-4 py-10 font-mono"
      initial="hidden"
      viewport={{ amount: 0.5, once: true }}
      variants={containerVariants}
      whileInView="visible"
    >
      <motion.h2
        className="mb-1 text-foreground text-sm uppercase tracking-wide"
        variants={itemVariants}
      >
        {page_career_eof()}
        <BlinkingCursor />
      </motion.h2>

      <motion.div
        className="mb-6 h-0.5 w-24 bg-linear-to-r from-primary to-transparent"
        style={{ transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        transition={UNDERLINE_TRANSITION}
        viewport={{ once: true }}
        whileInView={{ scaleX: 1 }}
      />

      <motion.p
        className="mb-1 text-muted-foreground text-xs leading-relaxed"
        variants={itemVariants}
      >
        {page_career_complete()}
      </motion.p>
      <motion.p
        className="text-muted-foreground text-xs leading-relaxed"
        variants={itemVariants}
      >
        {page_career_thanks()}
      </motion.p>
    </motion.div>
  );
}
