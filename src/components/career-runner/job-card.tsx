import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { useBoolean } from "usehooks-ts";
import type { ExpandedContent } from "@/components/career-timeline/config";
import ExpandedSection from "./expanded-section";

const GLOW_COLOR = "oklch(from var(--primary) l c h / 0.15)";

interface JobCardProps {
  title: string;
  subtitle: string;
  details: string[];
  expanded?: ExpandedContent;
  isActive?: boolean;
}

function getAnimationProps(prefersReducedMotion: boolean, isActive: boolean) {
  if (prefersReducedMotion) {
    return { opacity: isActive ? 1 : 0.6 };
  }

  return {
    scale: isActive ? 1.05 : 0.9,
    opacity: isActive ? 1 : 0.6,
    boxShadow: isActive
      ? `0 0 20px 5px ${GLOW_COLOR}, 0 0 40px 10px ${GLOW_COLOR}`
      : "0 0 0 0 transparent",
  };
}

export default function JobCard({
  title,
  subtitle,
  details,
  expanded,
  isActive = false,
}: JobCardProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  const {
    value: manuallyToggled,
    toggle: toggleManually,
    setFalse: resetToggle,
  } = useBoolean(false);

  const prevIsActive = useRef(isActive);
  if (prevIsActive.current !== isActive) {
    prevIsActive.current = isActive;
    if (!isActive) {
      resetToggle();
    }
  }

  const hasExpandableContent = !!expanded;
  const isExpanded = isActive && hasExpandableContent && !manuallyToggled;
  const canExpand = isActive && hasExpandableContent;

  const handleClick = () => {
    if (canExpand) {
      toggleManually();
    }
  };

  return (
    <div className="transition-transform">
      <motion.div
        animate={getAnimationProps(prefersReducedMotion, isActive)}
        className="border border-border bg-transparent p-3"
        layout
        onClick={handleClick}
        style={{
          width: isExpanded ? 288 : 192,
          willChange: "transform, opacity, box-shadow",
          transformOrigin: "center center",
          overflow: "hidden",
        }}
        transition={{
          duration: 0.5,
          ease: [0.25, 1, 0.5, 1],
          layout: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
        }}
        whileHover={isActive ? undefined : { y: -2 }}
      >
        <div className="mb-2 border-border border-b pb-2">
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-foreground text-xs uppercase tracking-wide">
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

        <AnimatePresence mode="wait">
          {!!isExpanded && !!expanded ? (
            <ExpandedSection expanded={expanded} />
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
