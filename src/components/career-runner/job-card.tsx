import { motion } from "motion/react";
import type { CardStyle } from "@/config/career-timeline";
import { cn } from "@/lib/utils";

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
  return (
    <motion.div
      className={cn(
        "w-48 border border-foreground bg-background p-3 font-mono",
        !!isCurrent && "border-2"
      )}
      whileHover={{ y: -2 }}
    >
      {/* Header with pixel style */}
      <div className="mb-2 border-foreground/30 border-b pb-2">
        <h3 className="font-bold text-xs uppercase tracking-wide">{title}</h3>
        <p className="text-foreground/60 text-xs">{subtitle}</p>
      </div>

      {/* Details */}
      <ul className="space-y-1">
        {details.map((detail) => (
          <li className="flex items-center gap-2 text-xs" key={detail}>
            <span className="text-foreground/40">{">"}</span>
            {detail}
          </li>
        ))}
      </ul>

      {/* Card style indicator */}
      <div className="mt-2 flex items-center gap-1">
        {style === "blackboard" && <StyleDot variant="muted" />}
        {style === "postit" && <StyleDot variant="warning" />}
        {style === "window" && <StyleDot variant="info" />}
        {style === "code" && <StyleDot variant="success" />}
        <span className="text-foreground/40 text-xs">{style}</span>
      </div>
    </motion.div>
  );
}

function StyleDot({ variant }: { variant: string }) {
  const colors: Record<string, string> = {
    muted: "bg-foreground/40",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
    success: "bg-green-500",
  };

  return <div className={cn("size-2 rounded-full", colors[variant])} />;
}
