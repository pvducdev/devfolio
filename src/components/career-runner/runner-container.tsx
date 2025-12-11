import type { PropsWithChildren } from "react";
import { UI_CONFIG } from "@/config/career-timeline.ts";
import { CareerScrollProvider } from "@/context/career-scroll.tsx";
import { useCareerScroll } from "@/hooks/use-career-scroll.ts";
import { cn } from "@/lib/utils.ts";

export default function RunnerContainer({ children }: PropsWithChildren) {
  const { containerRef } = useCareerScroll();

  return (
    <section
      aria-label="Career timeline"
      className={cn(
        "scrollbar-none flex h-full overflow-x-auto",
        UI_CONFIG.sectionSpace
      )}
      ref={containerRef}
    >
      <CareerScrollProvider containerRef={containerRef}>
        {children}
      </CareerScrollProvider>
    </section>
  );
}
