import AppContent from "@/components/layout/app-content.tsx";
import Header from "./header.tsx";
import StatusFooter from "./status-footer.tsx";

export default function Container() {
  return (
    <div className="grid size-full grid-rows-[auto_1fr_auto] overflow-hidden rounded-2xl bg-sidebar">
      <Header />
      <AppContent />
      <StatusFooter />
    </div>
  );
}
