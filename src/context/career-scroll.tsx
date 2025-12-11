import type { ReactNode, RefObject } from "react";
import createCtx from "@/lib/create-ctx.ts";

type CareerScrollContextValue = {
  containerRef: RefObject<HTMLDivElement | null>;
};

export const [useCareerScrollCtx, Provider] =
  createCtx<CareerScrollContextValue>(
    "useCareerScroll must be inside a Career Scroll"
  );

export function CareerScrollProvider({
  containerRef,
  children,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  return <Provider value={{ containerRef }}>{children}</Provider>;
}
