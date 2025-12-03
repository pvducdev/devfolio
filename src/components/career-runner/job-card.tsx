import { motion } from "motion/react";
import {
  type CardStyle,
  type JobType,
  MILESTONE_ANIMATION_CONFIG,
} from "@/config/career-timeline";
import { cn } from "@/lib/utils";
import { getCardStyle } from "./registries/card-styles";

type JobCardProps = {
  style: CardStyle;
  title: string;
  subtitle: string;
  details: string[];
  isCurrent?: boolean;
  isActive?: boolean;
  jobType?: JobType;
};

export function JobCard({
  style,
  title,
  subtitle,
  details,
  isCurrent,
  isActive,
  jobType,
}: JobCardProps) {
  const config = getCardStyle(style);
  const glowColor = jobType
    ? MILESTONE_ANIMATION_CONFIG.glowColors[jobType]
    : "transparent";

  return (
    <div className={cn("transition-transform", config.wrapper)}>
      <motion.div
        animate={{
          scale: isActive
            ? MILESTONE_ANIMATION_CONFIG.cardScaleActive
            : MILESTONE_ANIMATION_CONFIG.cardScaleInactive,
          opacity: isActive
            ? MILESTONE_ANIMATION_CONFIG.cardOpacityActive
            : MILESTONE_ANIMATION_CONFIG.cardOpacityInactive,
          boxShadow: isActive
            ? `0 0 20px 5px ${glowColor}, 0 0 40px 10px ${glowColor}`
            : "0 0 0 0 transparent",
        }}
        className={cn(
          "w-48 border p-3 font-mono",
          config.container,
          !!isCurrent && "border-2"
        )}
        style={{
          willChange: "transform, opacity, box-shadow",
          transformOrigin: "center center",
        }}
        transition={{
          duration: MILESTONE_ANIMATION_CONFIG.cardPop,
          ease: MILESTONE_ANIMATION_CONFIG.easing,
        }}
        whileHover={isActive ? undefined : { y: -2 }}
      >
        {config.titleBar ? <WindowTitleBar title={title} /> : null}

        <div className={cn("mb-2 border-b pb-2", config.header)}>
          <h3
            className={cn(
              "font-bold text-xs uppercase tracking-wide",
              config.title
            )}
          >
            {title}
          </h3>
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
