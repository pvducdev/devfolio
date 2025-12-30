import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  number: string;
  title: string;
  className?: string;
  align?: "left" | "right";
}

export default function SectionHeader({
  number,
  title,
  className,
  align = "left",
}: SectionHeaderProps) {
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
        {title}
      </span>
    </div>
  );
}
