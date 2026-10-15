import { cn } from "cn";
import type { LucideIcon } from "lucide-react";

interface LandmarkProps {
  icon: LucideIcon;
  className?: string;
}

export default function Landmark({ icon: Icon, className }: LandmarkProps) {
  return (
    <div className={cn("flex items-end", className)}>
      <Icon className="size-10 text-foreground" />
    </div>
  );
}
