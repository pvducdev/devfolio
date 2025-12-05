import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type LandmarkProps = {
  icon: LucideIcon;
  className?: string;
};

export function Landmark({ icon: Icon, className }: LandmarkProps) {
  return (
    <div className={cn("flex items-end", className)}>
      <Icon className="size-10 text-foreground" />
    </div>
  );
}
