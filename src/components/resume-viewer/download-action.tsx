import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFileDownload } from "@/hooks/use-file-download";
import { getLogger } from "@/lib/logger/client";
import {
  action_resume_download,
  ui_resume_downloading,
} from "@/paraglide/messages.js";

interface DownloadActionProps {
  url: string;
  filename: string;
}

export default function DownloadAction({ url, filename }: DownloadActionProps) {
  const { downloadFile, isDownloading } = useFileDownload();

  return (
    <Button
      disabled={isDownloading}
      onClick={() => {
        getLogger().info("Download resume");

        downloadFile({
          filename,
          url,
        });
      }}
    >
      {isDownloading ? ui_resume_downloading() : action_resume_download()}
      <Download />
    </Button>
  );
}
