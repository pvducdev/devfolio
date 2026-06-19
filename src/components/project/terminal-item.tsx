import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

const terminalItemVariants = cva("", {
  defaultVariants: {
    variant: "output",
  },
  variants: {
    variant: {
      command: "text-foreground",
      output: "text-muted-foreground",
    },
  },
});

const defaultAnimation = {
  animate: { filter: "blur(0px)", opacity: 1, y: 0 },
  exit: { filter: "blur(4px)", opacity: 0, y: -8 },
  initial: { filter: "blur(4px)", opacity: 0, y: 8 },
  transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] as const },
};

type TerminalItemProps = {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof terminalItemVariants> &
  Omit<ComponentPropsWithoutRef<typeof motion.div>, "children">;

export default function TerminalItem({
  variant,
  children,
  className,
  ...props
}: TerminalItemProps) {
  return (
    <motion.div
      className={cn(terminalItemVariants({ variant }), className)}
      {...defaultAnimation}
      {...props}
    >
      {children}
    </motion.div>
  );
}
