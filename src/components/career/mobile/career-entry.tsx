import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import type { Ref, RefObject } from "react";
import { useBoolean } from "usehooks-ts";

import type { CareerSection } from "@/components/career-runner/config";
import ExpandedSection from "@/components/career-runner/expanded-section";
import { cn } from "@/lib/utils";

interface CareerEntryProps {
  ref: Ref<HTMLDivElement>;
  section: CareerSection;
  isActive: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
}

const YearMarker = ({
  section,
  isActive,
}: {
  section: CareerSection;
  isActive: boolean;
}) => (
  <div className="absolute top-0 -left-14 w-14 pr-3 text-right">
    <motion.span
      animate={{
        color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
      }}
      className="font-mono text-[10px] tabular-nums tracking-wider"
      transition={{ damping: 25, stiffness: 300, type: "spring" }}
    >
      {section.year}
    </motion.span>
    <section.icon className="mt-1 ml-auto size-3 text-muted-foreground" />
  </div>
);

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

const CareerEntry = ({
  ref,
  section,
  isActive,
  scrollRef,
}: CareerEntryProps) => {
  const {
    value: manuallyToggled,
    toggle: toggleManually,
    setFalse: resetToggle,
  } = useBoolean(false);

  useEffect(() => {
    if (!isActive) {
      resetToggle();
    }
  }, [isActive, resetToggle]);

  const hasExpandableContent = !!section.card.expanded;
  const isExpanded = hasExpandableContent && !manuallyToggled;
  return (
    <div
      className="relative pb-36 [contain-intrinsic-size:auto_400px] [content-visibility:auto]"
      ref={ref}
    >
      <YearMarker isActive={isActive} section={section} />
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
                ▸ {section.card.title}
              </h3>
              <p className="font-mono text-[11px] text-muted-foreground">
                {section.card.subtitle} ({section.jobType})
              </p>
            </div>
            {hasExpandableContent ? (
              <button
                className="shrink-0 text-muted-foreground"
                onClick={toggleManually}
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
            {section.card.details.map((d) => (
              <li className="flex gap-2 font-mono text-xs" key={d}>
                <span className="text-muted-foreground">{">"}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          <AnimatePresence mode="wait">
            {isExpanded && section.card.expanded ? (
              <ExpandedSection expanded={section.card.expanded} />
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default CareerEntry;
