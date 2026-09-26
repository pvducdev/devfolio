import { cn } from "cn";
import { ArrowDown } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import type { ComponentProps } from "react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const BOTTOM_THRESHOLD = 0.95;

type ScrollAreaWithAnchorProps = ComponentProps<typeof ScrollArea>;

export default function ScrollAreaWithAnchor({
  className,
  children,
  ...props
}: ScrollAreaWithAnchorProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const { scrollYProgress } = useScroll({ container: viewportRef });
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setIsAtBottom(progress > BOTTOM_THRESHOLD);
  });

  const scrollToBottom = () => {
    viewportRef.current?.scrollTo({
      behavior: "smooth",
      top: viewportRef.current.scrollHeight,
    });
  };

  return (
    <ScrollArea
      className={cn("overflow-hidden", className)}
      viewportRef={viewportRef}
      {...props}
    >
      {children}
      <Button
        className={cn(
          "absolute bottom-2 left-1/2 z-10 size-8 -translate-x-1/2 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ease-out",
          isAtBottom
            ? "pointer-events-none translate-y-4 opacity-0"
            : "translate-y-0 opacity-100"
        )}
        onClick={scrollToBottom}
        size="icon"
        variant="secondary"
      >
        <ArrowDown />
      </Button>
    </ScrollArea>
  );
}
