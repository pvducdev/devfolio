import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useBoolean } from "usehooks-ts";
import type { ExpandedContent } from "@/config/career-timeline";
import { cn } from "@/lib/utils";
import { ExpandedSection } from "./expanded-section";

const GLOW_COLOR = "oklch(from var(--primary) l c h / 0.4)";

type JobCardProps = {
  title: string;
  subtitle: string;
  details: string[];
  expanded?: ExpandedContent;
  isCurrent?: boolean;
  isActive?: boolean;
};

export function JobCard({
  title,
  subtitle,
  details,
  expanded,
  isCurrent,
  isActive,
}: JobCardProps) {
  const {
    value: isExpanded,
    toggle: toggleExpanded,
    setFalse: collapse,
  } = useBoolean(false);

  const canExpand = isActive && expanded;

  useEffect(() => {
    if (!isActive) {
      collapse();
    }
  }, [isActive, collapse]);

  const handleClick = () => {
    if (canExpand) {
      toggleExpanded();
    }
  };

  return (
    <div className="transition-transform">
      <motion.div
        animate={{
          scale: isActive ? 1.05 : 0.9,
          opacity: isActive ? 1 : 0.6,
          boxShadow: isActive
            ? `0 0 20px 5px ${GLOW_COLOR}, 0 0 40px 10px ${GLOW_COLOR}`
            : "0 0 0 0 transparent",
        }}
        className={cn(
          "border border-border bg-transparent p-3 font-mono",
          isExpanded ? "w-72" : "w-48",
          !!isCurrent && "border-2",
          !!canExpand && "cursor-pointer"
        )}
        layout
        onClick={handleClick}
        style={{
          willChange: "transform, opacity, box-shadow",
          transformOrigin: "center center",
        }}
        transition={{
          duration: 0.5,
          ease: [0.25, 1, 0.5, 1],
        }}
        whileHover={isActive ? undefined : { y: -2 }}
      >
        <div className="mb-2 border-border border-b pb-2">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-bold text-foreground text-xs uppercase tracking-wide">
              {title}
            </h3>
            {canExpand ? (
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                className="shrink-0 text-muted-foreground"
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="size-3" />
              </motion.span>
            ) : null}
          </div>
          <p className="text-muted-foreground text-xs">{subtitle}</p>
        </div>

        <ul className="space-y-1">
          {details.map((detail) => (
            <li className="flex items-center gap-2 text-xs" key={detail}>
              <span className="text-muted-foreground">{">"}</span>
              <span className="text-foreground">{detail}</span>
            </li>
          ))}
        </ul>

        <AnimatePresence>
          {!!isExpanded && !!expanded ? (
            <ExpandedSection expanded={expanded} />
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
