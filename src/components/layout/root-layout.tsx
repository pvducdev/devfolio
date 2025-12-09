import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils.ts";
import { useAppLayoutStore } from "@/store/app-layout.ts";

export default function RootLayout({ children }: PropsWithChildren) {
  const isStretchLayout = useAppLayoutStore((state) => state.isStretchLayout);

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
