import { AnimatePresence } from "motion/react";
import type { ReactNode } from "react";

interface TerminalProps {
  children: ReactNode;
}

export default function Terminal({ children }: TerminalProps) {
  return (
    <div className="flex h-full flex-col space-y-1 overflow-hidden p-2 font-mono text-xs">
      <AnimatePresence mode="popLayout">{children}</AnimatePresence>
    </div>
  );
}
