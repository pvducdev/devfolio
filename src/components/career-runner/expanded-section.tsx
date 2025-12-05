import { motion } from "motion/react";
import type { ExpandedContent } from "@/config/career-timeline";
import { TechStackSection } from "./tech-stack-section";

type ExpandedSectionProps = {
  expanded: ExpandedContent;
};

export function ExpandedSection({ expanded }: ExpandedSectionProps) {
  return (
    <motion.div
      animate={{ opacity: 1, height: "auto" }}
      className="overflow-hidden"
      exit={{ opacity: 0, height: 0 }}
      initial={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
    >
      <div className="mt-3 border-border border-t pt-3">
        <p className="mb-3 text-foreground text-xs leading-relaxed">
          {expanded.description}
        </p>

        <div className="space-y-2">
          <TechStackSection items={expanded.techStack.primary} label="Stack" />
          {expanded.techStack.tools ? (
            <TechStackSection items={expanded.techStack.tools} label="Tools" />
          ) : null}
          {expanded.techStack.infrastructure ? (
            <TechStackSection
              items={expanded.techStack.infrastructure}
              label="Infra"
            />
          ) : null}
        </div>

        {!!expanded.metrics && expanded.metrics.length > 0 ? (
          <div className="mt-3">
            <span className="mb-1 block font-semibold text-[10px] text-muted-foreground uppercase">
              Metrics
            </span>
            <ul className="space-y-0.5">
              {expanded.metrics.map((metric) => (
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
