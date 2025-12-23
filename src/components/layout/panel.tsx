import Assistant from "@/components/assistant/container.tsx";

interface PanelProps {
  onClose: () => void;
}

export default function Panel({ onClose }: PanelProps) {
  return <Assistant onClose={onClose} />;
}
