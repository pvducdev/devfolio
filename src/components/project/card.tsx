import { motion } from "motion/react";
import type { ReactNode } from "react";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";

interface CardProps {
  title?: string;
  className?: string;
  children: ReactNode;
}

export default function Card({ title, className, children }: CardProps) {
  const [ref, bounds] = useMeasure();

  return (
    <motion.div
      animate="center"
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
      exit="exit"
      initial="enter"
      transition={{
        duration: 0.3,
      }}
      variants={{
        center: {
          height: bounds.height > 0 ? bounds.height : "auto",
          opacity: 1,
        },
        enter: {
          height: bounds.height > 0 ? bounds.height : "auto",
          opacity: 0,
        },
        exit: {
          height: bounds.height > 0 ? bounds.height : "auto",
          opacity: 0,
        },
      }}
    >
      <div className="flex items-center gap-2 border-border border-b px-3 py-2">
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
      <div className="content" ref={ref}>
        {children}
      </div>
    </motion.div>
  );
}
