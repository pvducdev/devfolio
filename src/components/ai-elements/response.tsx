"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { Streamdown } from "streamdown";

type ResponseProps = ComponentProps<typeof Streamdown>;

export function Response({ className, ...props }: ResponseProps) {
  return (
    <Streamdown
      className={cn(
        "size-full font-serif [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      {...props}
    />
  );
}
