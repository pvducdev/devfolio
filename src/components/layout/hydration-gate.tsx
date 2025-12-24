import type { PropsWithChildren, ReactNode } from "react";
import { useHasHydrated } from "@/store/app-layout";

interface HydrationGateProps {
  fallback: ReactNode;
}

export function HydrationGate({
  children,
  fallback,
}: PropsWithChildren<HydrationGateProps>) {
  const hasHydrated = useHasHydrated();

  if (!hasHydrated) {
    return fallback;
  }

  return children;
}
