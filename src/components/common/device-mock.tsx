import type { ComponentProps } from "react";
import { Iphone } from "@/components/ui/iphone.tsx";
import { Safari } from "@/components/ui/safari.tsx";

type DeviceMockProps =
  | (ComponentProps<typeof Iphone> & { type: "mobile" })
  | (ComponentProps<typeof Safari> & { type: "desktop" });

export default function DeviceMock({ type, ...rest }: DeviceMockProps) {
  if (type === "desktop") {
    return <Safari {...rest} />;
  }

  if (type === "mobile") {
    return <Iphone {...rest} />;
  }

  return null;
}
