import { useState } from "react";

const saveBlob = (blob: Blob, filename: string): void => {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
};

export const useFileDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = async (url: string, filename: string) => {
    setIsDownloading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Download of ${url} responded ${response.status}`);
      }
      saveBlob(await response.blob(), filename);
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadFile, isDownloading };
};
