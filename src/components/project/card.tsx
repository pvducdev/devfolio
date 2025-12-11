import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CardProps = {
  title?: string;
  className?: string;
  children: ReactNode;
};

export function Card({ title, className, children }: CardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card",
        className
      )}
    >
      <div className="flex items-center gap-2 border-border border-b bg-muted/30 px-3 py-2">
        <div className="flex gap-1">
          <div className="size-2.5 rounded-full bg-muted-foreground/30" />
          <div className="size-2.5 rounded-full bg-muted-foreground/30" />
          <div className="size-2.5 rounded-full bg-muted-foreground/30" />
        </div>

        {!!title && (
          <span className="ml-2 font-mono text-muted-foreground text-xs">
            {title}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}
