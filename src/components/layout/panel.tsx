import { lazy, Suspense } from "react";
import { ui_state_loading } from "@/paraglide/messages.js";

const Assistant = lazy(() => import("@/components/assistant/container.tsx"));

interface PanelProps {
  onClose: () => void;
}

export default function Panel({ onClose }: PanelProps) {
  return (
    <Suspense fallback={<p className="mx-auto">{ui_state_loading()}</p>}>
      <Assistant onClose={onClose} />
    </Suspense>
  );
}
