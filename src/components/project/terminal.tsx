import { AnimatePresence } from "motion/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TerminalProps {
  children: ReactNode;
  mode?: ComponentPropsWithoutRef<typeof AnimatePresence>["mode"];
  className?: string;
}

export function Terminal({
  children,
  mode = "popLayout",
  className,
}: TerminalProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col space-y-1 overflow-hidden p-2 font-mono text-xs",
        className
      )}
    >
      <AnimatePresence mode={mode}>{children}</AnimatePresence>
    </div>
  );
}
