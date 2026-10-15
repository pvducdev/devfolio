import { cn } from "cn";
import type { PropsWithChildren } from "react";

import { UI_CONFIG } from "../config";
import { CareerScrollContext } from "./scroll-context";
import { useCareerScroll } from "./use-career-scroll";

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
      <CareerScrollContext value={containerRef}>{children}</CareerScrollContext>
    </section>
  );
}
