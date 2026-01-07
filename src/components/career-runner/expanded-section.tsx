import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  page_career_label_infra,
  page_career_label_metrics,
  page_career_label_stack,
  page_career_label_tools,
} from "@/paraglide/messages.js";
import type { ExpandedContent } from "./config";
import TechStackSection from "./tech-stack-section";

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      opacity: { duration: 0.2, ease: "easeIn" },
      height: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
    },
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      opacity: { duration: 0.25, delay: 0.15, ease: "easeOut" },
      height: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
    },
  },
};

interface ExpandedSectionProps {
  expanded: ExpandedContent;
}

export default function ExpandedSection({ expanded }: ExpandedSectionProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const hasMetrics = !!expanded.metrics && expanded.metrics.length > 0;

  return (
    <motion.div
      animate="visible"
      className="overflow-hidden"
      exit="hidden"
      initial="hidden"
      {...(prefersReducedMotion ? {} : { variants: containerVariants })}
    >
      <div className="mt-3 border-border border-t pt-3">
        <p className="mb-3 text-foreground text-xs leading-relaxed">
          {expanded.description}
        </p>

        <div className="space-y-2">
          <TechStackSection
            items={expanded.techStack.primary}
            label={page_career_label_stack()}
          />
          {expanded.techStack.tools ? (
            <TechStackSection
              items={expanded.techStack.tools}
              label={page_career_label_tools()}
            />
          ) : null}
          {expanded.techStack.infrastructure ? (
            <TechStackSection
              items={expanded.techStack.infrastructure}
              label={page_career_label_infra()}
            />
          ) : null}
        </div>

        {hasMetrics ? (
          <div className="mt-3">
            <span className="mb-1 block font-semibold text-muted-foreground text-xs uppercase">
              {page_career_label_metrics()}
            </span>
            <ul className="space-y-0.5">
              {expanded.metrics?.map((metric) => (
                <li
                  className="flex items-center gap-1.5 text-foreground text-xs"
                  key={metric}
                >
                  <span className="text-muted-foreground">*</span>
                  {metric}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
