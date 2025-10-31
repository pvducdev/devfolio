import { Download } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import useFileDownload from "@/hooks/use-file-download.ts";

type DownloadActionProps = {
  url: string;
  filename: string;
};

export default function DownloadAction({ url, filename }: DownloadActionProps) {
  const { downloadFile, isDownloading } = useFileDownload();

  return (
    <Button
      disabled={isDownloading}
      onClick={() => {
        downloadFile({
          url,
          filename,
        });
      }}
    >
      {isDownloading ? "Downloading..." : "Download now"}
      <Download />
    </Button>
  );
}
