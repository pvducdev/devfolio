import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getLogger } from "@/lib/logger";
import {
  action_resume_download,
  ui_resume_downloading,
} from "@/paraglide/messages.js";

import { useFileDownload } from "./use-file-download";

interface DownloadActionProps {
  url: string;
  filename: string;
}

export default function DownloadAction({ url, filename }: DownloadActionProps) {
  const { downloadFile, isDownloading } = useFileDownload();

  const handleDownload = async () => {
    const logger = getLogger();
    try {
      await downloadFile(url, filename);
      await logger.info("Download resume");
    } catch (error) {
      await logger.error("Failed to download resume", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  return (
    <Button disabled={isDownloading} onClick={handleDownload}>
      {isDownloading ? ui_resume_downloading() : action_resume_download()}
      <Download />
    </Button>
  );
}
