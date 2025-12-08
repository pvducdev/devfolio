import { Download } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import useFileDownload from "@/hooks/use-file-download.ts";
import { resume_download, resume_downloading } from "@/paraglide/messages.js";

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
      {isDownloading ? resume_downloading() : resume_download()}
      <Download />
    </Button>
  );
}
