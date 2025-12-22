import { ArrowDown } from "lucide-react";
import type { ComponentProps } from "react";
import { useLayoutEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScrollY } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils.ts";

type ScrollAreaWithAnchorProps = ComponentProps<typeof ScrollArea>;

export default function ScrollAreaWithAnchor({
  className,
  children,
  ...props
}: ScrollAreaWithAnchorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const { isAtBottom } = useScrollY({ container: viewportRef });

  const scrollToBottom = () => {
    viewportRef.current?.scrollTo({
      top: viewportRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useLayoutEffect(() => {
    viewportRef.current =
      containerRef.current?.querySelector<HTMLDivElement>(
        "[data-slot='scroll-area-viewport']"
      ) ?? null;
  }, []);

  return (
    <ScrollArea
      className={cn("overflow-hidden", className)}
      ref={containerRef}
      {...props}
    >
      {children}
      <Button
        className={cn(
          "-translate-x-1/2 absolute bottom-2 left-1/2 z-10 size-8 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ease-out",
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
