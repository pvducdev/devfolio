import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { CardStyle, ExpandedContent } from "@/config/career-timeline";
import { cn } from "@/lib/utils";
import { getCardStyle } from "./registries/card-styles";

type JobCardProps = {
  style: CardStyle;
  title: string;
  subtitle: string;
  details: string[];
  expanded?: ExpandedContent;
  isCurrent?: boolean;
  isActive?: boolean;
};

export function JobCard({
  style,
  title,
  subtitle,
  details,
  expanded,
  isCurrent,
  isActive,
}: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const config = getCardStyle(style);

  const canExpand = isActive && expanded;

  // Auto-collapse when card becomes inactive
  useEffect(() => {
    if (!isActive) {
      setIsExpanded(false);
    }
  }, [isActive]);

  const handleClick = () => {
    if (canExpand) {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <div className={cn("transition-transform", config.wrapper)}>
      <motion.div
        animate={{
          scale: isActive ? 1.05 : 0.9,
          opacity: isActive ? 1 : 0.6,
          boxShadow: isActive
            ? `0 0 20px 5px ${config.glowColor}, 0 0 40px 10px ${config.glowColor}`
            : "0 0 0 0 transparent",
        }}
        className={cn(
          "border p-3 font-mono",
          isExpanded ? "w-72" : "w-48",
          config.container,
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
        {config.titleBar ? <WindowTitleBar title={title} /> : null}

        <div className={cn("mb-2 border-b pb-2", config.header)}>
          <div className="flex items-start justify-between gap-1">
            <h3
              className={cn(
                "font-bold text-xs uppercase tracking-wide",
                config.title
              )}
            >
              {title}
            </h3>
            {canExpand ? (
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                className={cn("shrink-0", config.subtitle)}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="size-3" />
              </motion.span>
            ) : null}
          </div>
          <p className={cn("text-xs", config.subtitle)}>{subtitle}</p>
        </div>

        <ul className="space-y-1">
          {details.map((detail, index) => (
            <li className="flex items-center gap-2 text-xs" key={detail}>
              <span className={config.detailPrefix}>
                {config.lineNumbers ? `${index + 1}` : ">"}
              </span>
              <span className={config.detailText}>{detail}</span>
            </li>
          ))}
        </ul>

        <AnimatePresence>
          {!!isExpanded && !!expanded ? (
            <ExpandedSection config={config} expanded={expanded} />
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function WindowTitleBar({ title }: { title: string }) {
  return (
    <div className="-mx-3 -mt-3 mb-2 flex items-center gap-1.5 bg-foreground/10 px-2 py-1.5">
      <div className="size-2.5 rounded-full bg-red-500" />
      <div className="size-2.5 rounded-full bg-yellow-500" />
      <div className="size-2.5 rounded-full bg-green-500" />
      <span className="ml-2 truncate text-foreground/50 text-xs">{title}</span>
    </div>
  );
}

type ExpandedSectionProps = {
  expanded: ExpandedContent;
  config: ReturnType<typeof getCardStyle>;
};

function ExpandedSection({ expanded, config }: ExpandedSectionProps) {
  return (
    <motion.div
      animate={{ opacity: 1, height: "auto" }}
      className="overflow-hidden"
      exit={{ opacity: 0, height: 0 }}
      initial={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
    >
      <div className={cn("mt-3 border-t pt-3", config.header)}>
        <p className={cn("mb-3 text-xs leading-relaxed", config.detailText)}>
          {expanded.description}
        </p>

        <div className="space-y-2">
          <TechStackSection
            config={config}
            items={expanded.techStack.primary}
            label="Stack"
          />
          {expanded.techStack.tools ? (
            <TechStackSection
              config={config}
              items={expanded.techStack.tools}
              label="Tools"
            />
          ) : null}
          {expanded.techStack.infrastructure ? (
            <TechStackSection
              config={config}
              items={expanded.techStack.infrastructure}
              label="Infra"
            />
          ) : null}
        </div>

        {!!expanded.metrics && expanded.metrics.length > 0 ? (
          <div className="mt-3">
            <span
              className={cn(
                "mb-1 block font-semibold text-[10px] uppercase",
                config.subtitle
              )}
            >
              Metrics
            </span>
            <ul className="space-y-0.5">
              {expanded.metrics.map((metric) => (
                <li
                  className={cn(
                    "flex items-center gap-1.5 text-xs",
                    config.detailText
                  )}
                  key={metric}
                >
                  <span className={config.detailPrefix}>*</span>
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

type TechStackSectionProps = {
  label: string;
  items: string[];
  config: ReturnType<typeof getCardStyle>;
};

function TechStackSection({ label, items, config }: TechStackSectionProps) {
  return (
    <div>
      <span
        className={cn(
          "mb-0.5 block font-semibold text-[10px] uppercase",
          config.subtitle
        )}
      >
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <span
            className={cn(
              "rounded px-1 py-0.5 text-[10px]",
              config.detailText,
              "bg-current/10"
            )}
            key={item}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
