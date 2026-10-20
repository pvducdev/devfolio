import { cn } from "cn";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Ref, RefObject } from "react";

import type { CareerEntry as TCareerEntry } from "@/config/career";

import { JOB_TYPE_ICONS } from "../config";
import ExpandedSection from "../expanded-section";
import { useCollapsed } from "../use-collapsed";

interface CareerEntryProps {
  ref: Ref<HTMLDivElement>;
  entry: TCareerEntry;
  isActive: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
}

const YearMarker = ({
  entry,
  isActive,
}: {
  entry: TCareerEntry;
  isActive: boolean;
}) => {
  const JobTypeIcon = JOB_TYPE_ICONS[entry.jobType];

  return (
    <div className="absolute top-0 -left-14 w-14 pr-3 text-right">
      <motion.span
        animate={{
          color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
        }}
        className="font-mono text-[10px] tabular-nums tracking-wider"
        transition={{ damping: 25, stiffness: 300, type: "spring" }}
      >
        {entry.year}
      </motion.span>
      <JobTypeIcon className="mt-1 ml-auto size-3 text-muted-foreground" />
    </div>
  );
};

const TimelineDot = ({ isActive }: { isActive: boolean }) => (
  <motion.div
    animate={isActive ? { scale: [1, 1.4, 1] } : { scale: 1 }}
    className={cn(
      "absolute top-1 -left-1.25 size-2.5 rounded-full border-2",
      isActive ? "border-primary bg-primary" : "border-border bg-background"
    )}
    transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
  />
);

const CareerEntry = ({ ref, entry, isActive, scrollRef }: CareerEntryProps) => {
  const { isCollapsed, toggleCollapsed } = useCollapsed(isActive);

  const hasExpandableContent = !!entry.expanded;
  const isExpanded = hasExpandableContent && !isCollapsed;
  return (
    <div
      className="relative pb-36 [contain-intrinsic-size:auto_400px] [content-visibility:auto]"
      ref={ref}
    >
      <YearMarker isActive={isActive} entry={entry} />
      <TimelineDot isActive={isActive} />

      <div
        className={cn(
          "absolute top-2.5 -left-px h-px w-8",
          isActive ? "bg-primary" : "bg-border"
        )}
      />

      <motion.div
        className="ml-10"
        initial={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        viewport={{ amount: 0.3, once: true, root: scrollRef }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <div
          className={cn(
            "border border-border border-dashed p-3 transition-shadow",
            isActive &&
              "border-solid shadow-[0_0_20px_-5px_oklch(from_var(--primary)_l_c_h/0.2)]"
          )}
        >
          <div className="mb-2 flex items-start justify-between border-border border-b pb-2">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wide">
                ▸ {entry.title}
              </h3>
              <p className="font-mono text-[11px] text-muted-foreground">
                {entry.company} ({entry.jobType})
              </p>
            </div>
            {hasExpandableContent ? (
              <button
                className="shrink-0 text-muted-foreground"
                onClick={toggleCollapsed}
                type="button"
              >
                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  className="block"
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="size-3" />
                </motion.span>
              </button>
            ) : null}
          </div>

          <ul className="space-y-1">
            {entry.details.map((d) => (
              <li className="flex gap-2 font-mono text-xs" key={d}>
                <span className="text-muted-foreground">{">"}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          <AnimatePresence mode="wait">
            {isExpanded && entry.expanded ? (
              <ExpandedSection expanded={entry.expanded} />
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default CareerEntry;
