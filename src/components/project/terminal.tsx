import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useSequence } from "@/hooks/use-sequence";
import { cn } from "@/lib/utils";

type TerminalLine = {
  id: string;
  type: "command" | "output" | "success";
  text: string;
};

const TERMINAL_STEPS: TerminalLine[] = [
  { id: "install", type: "command", text: "$ bun install" },
  { id: "output", type: "output", text: "Resolving dependencies..." },
  { id: "done", type: "success", text: "✓ Installed 42 packages" },
];

export type TerminalProps = {
  className?: string;
};

export function Terminal({ className }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);

  const sequence = useSequence({
    steps: TERMINAL_STEPS.map((line) => ({
      id: line.id,
      action: () => line,
    })),
    autoStart: true,
    autoSequence: true,
    delay: 800,
    loop: Number.POSITIVE_INFINITY,
    loopDelay: 3000,
    onStepComplete: (_, data) => {
      if (data) {
        setLines((prev) => [...prev, data]);
      }
    },
    onLoop: () => setLines([]),
  });

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden font-mono text-xs",
        className
      )}
    >
      <div className="flex-1 space-y-1 p-3">
        <AnimatePresence mode="popLayout">
          {lines.map((line) => (
            <motion.div
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              className={cn(
                line.type === "command" && "text-foreground",
                line.type === "output" && "text-muted-foreground",
                line.type === "success" && "text-emerald-500"
              )}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              key={line.id}
              transition={{
                duration: 0.3,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              {line.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {sequence.status === "running" && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            className="inline-block text-muted-foreground"
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: 0.5,
            }}
          >
            ▋
          </motion.span>
        )}
      </div>
    </div>
  );
}
