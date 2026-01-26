"use client";

import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  json: Record<string, unknown>;
  className?: string;
}

export function CodeBlock({ json, className }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "overflow-auto whitespace-pre-wrap break-words p-2 font-mono text-card-foreground text-xs leading-relaxed",
        className
      )}
    >
      {JSON.stringify(json, null, 2)}
    </pre>
  );
}
