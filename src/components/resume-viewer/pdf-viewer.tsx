import { createPluginRegistration } from "@embedpdf/core";
import { EmbedPDF } from "@embedpdf/core/react";
import { usePdfiumEngine } from "@embedpdf/engines/react";
import { LoaderPluginPackage } from "@embedpdf/plugin-loader/react";
import {
  RenderLayer,
  RenderPluginPackage,
} from "@embedpdf/plugin-render/react";
import { Scroller, ScrollPluginPackage } from "@embedpdf/plugin-scroll/react";
import {
  Viewport,
  ViewportPluginPackage,
} from "@embedpdf/plugin-viewport/react";
import { Skeleton } from "@/components/ui/skeleton.tsx";

type ResumePDFViewerProps = {
  className?: string;
  url: string;
};

export default function PdfViewer({ className, url }: ResumePDFViewerProps) {
  const { engine, isLoading } = usePdfiumEngine();

  const plugins = [
    createPluginRegistration(LoaderPluginPackage, {
      loadingOptions: {
        type: "url",
        pdfFile: {
          id: "my-resume",
          url,
        },
      },
    }),
    createPluginRegistration(ViewportPluginPackage),
    createPluginRegistration(ScrollPluginPackage),
    createPluginRegistration(RenderPluginPackage),
  ];

  if (isLoading || !engine) {
    return (
      <div className="mx-auto flex flex-col space-y-3">
        <Skeleton className="h-48 w-lg rounded-xl" />
        <Skeleton className="h-48 w-lg rounded-xl" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-lg" />
          <Skeleton className="h-4 w-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <EmbedPDF engine={engine} plugins={plugins}>
        <Viewport>
          <Scroller
            renderPage={({ width, height, pageIndex, scale }) => (
              <div style={{ width, height }}>
                <RenderLayer pageIndex={pageIndex} scale={scale} />
              </div>
            )}
          />
        </Viewport>
      </EmbedPDF>
    </div>
  );
}
