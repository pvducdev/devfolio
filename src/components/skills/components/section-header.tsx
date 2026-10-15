import { cn } from "cn";

import { SKILL_SECTIONS } from "../sections";
import type { SkillSectionId } from "../sections";

interface SectionHeaderProps {
  section: SkillSectionId;
  className?: string;
  align?: "left" | "right";
}

export default function SectionHeader({
  section,
  className,
  align = "left",
}: SectionHeaderProps) {
  const { number, title } = SKILL_SECTIONS[section];

  return (
    <div
      className={cn(
        "flex items-center gap-3 border-border border-b pb-1.5",
        align === "right" && "justify-end md:justify-start",
        className
      )}
    >
      <span className="font-bold font-mono text-muted-foreground text-xs">
        {number}
      </span>
      <span className="font-bold text-muted-foreground text-xs uppercase tracking-wide">
        {title()}
      </span>
    </div>
  );
}
