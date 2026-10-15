import { cn } from "cn";
import type { PropsWithChildren } from "react";

import { useIsStretchLayout } from "@/components/layout/store";

export default function RootLayout({ children }: PropsWithChildren) {
  const isStretchLayout = useIsStretchLayout();

  return (
    <div
      className={cn(
        "h-screen w-screen overflow-hidden bg-accent-foreground transition-all duration-300",
        !isStretchLayout && "p-1"
      )}
    >
      <div
        className={cn(
          "grid size-full grid-rows-[auto_1fr_auto] overflow-hidden bg-sidebar transition-all duration-300",
          !isStretchLayout && "rounded-2xl"
        )}
      >
        {children}
      </div>
    </div>
  );
}
