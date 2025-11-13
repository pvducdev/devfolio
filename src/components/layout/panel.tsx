import { useShallow } from "zustand/react/shallow";
import AiContainer from "@/components/assistant/container.tsx";
import { useAppLayoutStore } from "@/store/app-layout.ts";

export default function Panel() {
  const [togglePanel] = useAppLayoutStore(
    useShallow((state) => [state.togglePanel])
  );

  return (
    <AiContainer
      onClose={() => {
        togglePanel("assistant");
      }}
    />
  );
}
