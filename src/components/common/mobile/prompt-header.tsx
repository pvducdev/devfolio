import { cn } from "@/lib/utils";
import { useCurrentCommand } from "@/store/mobile-shell";

interface PromptHeaderProps {
  typingText: string;
  isTyping: boolean;
}

export default function PromptHeader({
  typingText,
  isTyping,
}: PromptHeaderProps) {
  const currentCommand = useCurrentCommand();
  const displayText = isTyping ? typingText : currentCommand;

  return (
    <div className="flex h-10 shrink-0 items-center gap-2 px-4 font-mono text-sm">
      <span className="text-muted-foreground">$</span>
      <span className="text-foreground">{displayText}</span>
      <span
        className={cn(
          "inline-block h-4 w-0.5 bg-foreground",
          isTyping && "animate-pulse"
        )}
      />
    </div>
  );
}
