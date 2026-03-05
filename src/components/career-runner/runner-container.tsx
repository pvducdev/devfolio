import type { PropsWithChildren } from "react";
import { CareerScrollProvider } from "@/context/career-scroll";
import { useCareerScroll } from "@/hooks/use-career-scroll";
import { cn } from "@/lib/utils";
import { UI_CONFIG } from "./config";

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
