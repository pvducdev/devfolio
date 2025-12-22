import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

const terminalItemVariants = cva("", {
  variants: {
    variant: {
      command: "text-foreground",
      output: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "output",
  },
});

const defaultAnimation = {
  initial: { opacity: 0, y: 8, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(4px)" },
  transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] as const },
};

export type TerminalItemProps = {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof terminalItemVariants> &
  Omit<ComponentPropsWithoutRef<typeof motion.div>, "children">;

export function TerminalItem({
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
