import { motion } from "motion/react";
import type { CardStyle } from "@/config/career-timeline";
import { cn } from "@/lib/utils";

type CardStyleConfig = {
  container: string;
  header: string;
  title: string;
  subtitle: string;
  detailPrefix: string;
  detailText: string;
  wrapper: string;
  titleBar?: boolean;
  lineNumbers?: boolean;
};

function getCardStyleConfig(style: CardStyle): CardStyleConfig {
  switch (style) {
    case "blackboard":
      return {
        container:
          "bg-foreground text-background border-2 border-background/20",
        header: "border-background/30",
        title: "text-background",
        subtitle: "text-background/70",
        detailPrefix: "text-background/50",
        detailText: "text-background/90",
        wrapper: "",
      };
    case "postit":
      return {
        container:
          "bg-yellow-100 text-yellow-900 border-yellow-300 shadow-lg dark:bg-yellow-200",
        header: "border-yellow-400/50",
        title: "text-yellow-900",
        subtitle: "text-yellow-700",
        detailPrefix: "text-yellow-600",
        detailText: "text-yellow-800",
        wrapper: "rotate-1",
      };
    case "window":
      return {
        container:
          "bg-background border-foreground/50 rounded-lg overflow-hidden",
        header: "border-foreground/20",
        title: "text-foreground",
        subtitle: "text-foreground/60",
        detailPrefix: "text-foreground/40",
        detailText: "text-foreground",
        wrapper: "",
        titleBar: true,
      };
    case "code":
      return {
        container:
          "bg-zinc-900 text-green-400 border-green-500/30 dark:bg-zinc-950",
        header: "border-green-500/20",
        title: "text-green-300",
        subtitle: "text-green-500/70",
        detailPrefix: "text-green-600",
        detailText: "text-green-400",
        wrapper: "",
        lineNumbers: true,
      };
    default:
      return {
        container: "bg-background border-foreground",
        header: "border-foreground/30",
        title: "text-foreground",
        subtitle: "text-foreground/60",
        detailPrefix: "text-foreground/40",
        detailText: "text-foreground",
        wrapper: "",
      };
  }
}

type JobCardProps = {
  style: CardStyle;
  title: string;
  subtitle: string;
  details: string[];
  isCurrent?: boolean;
};

export function JobCard({
  style,
  title,
  subtitle,
  details,
  isCurrent,
}: JobCardProps) {
  const config = getCardStyleConfig(style);

  return (
    <div className={cn("transition-transform", config.wrapper)}>
      <motion.div
        className={cn(
          "w-48 border p-3 font-mono",
          config.container,
          !!isCurrent && "border-2"
        )}
        whileHover={{ y: -2 }}
      >
        {/* Window title bar for "window" style */}
        {config.titleBar ? <WindowTitleBar title={title} /> : null}

        {/* Header */}
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

        {/* Details */}
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
