"use client";
import {
  motion,
  type MotionValue,
  type SpringOptions,
  useSpring,
  useTransform,
} from "motion/react";
import { type ElementType, useEffect } from "react";

import { cn } from "@/lib/utils";

export type AnimatedNumberProps = {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
  as?: ElementType;
};

export function AnimatedNumber({
  value,
  className,
  springOptions,
  as = "span",
}: AnimatedNumberProps) {
  const MotionComponent = motion.create(
    as as keyof React.JSX.IntrinsicElements
  ) as React.ComponentType<{
    className?: string;
    children?: React.ReactNode | MotionValue<string> | MotionValue<number>;
  }>;

  const spring = useSpring(value, springOptions);
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <MotionComponent className={cn("tabular-nums", className)}>
      {display}
    </MotionComponent>
  );
}
