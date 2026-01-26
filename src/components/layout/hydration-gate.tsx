import { useHydrated } from "@tanstack/react-router";
import type { PropsWithChildren, ReactNode } from "react";

interface HydrationGateProps {
  fallback: ReactNode;
}

export function HydrationGate({
  children,
  fallback,
}: PropsWithChildren<HydrationGateProps>) {
  const hasHydrated = useHydrated();

  if (!hasHydrated) {
    return fallback;
  }

  return children;
}
