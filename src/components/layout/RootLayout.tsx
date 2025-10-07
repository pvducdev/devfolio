import type * as React from "react";
import RootEditor from "@/components/layout/RootEditor.tsx";
import RootFooter from "@/components/layout/RootFooter.tsx";
import RootHeader from "@/components/layout/RootHeader.tsx";
import RootSidebar from "@/components/layout/RootSidebar.tsx";

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="rounded-2xl size-full bg-white overflow-hidden flex flex-col">
      <RootHeader />
      <div className="flex-1 flex">
        <RootSidebar />
        <RootEditor>{children}</RootEditor>
      </div>
      <RootFooter />
    </div>
  );
}
