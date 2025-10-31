import { useState } from "react";

type DownloadState = {
  isDownloading: boolean;
  error: string | null;
};

type DownloadFileOptions = {
  url: string;
  filename?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
};

type DownloadDataOptions = {
  data: BlobPart;
  filename: string;
  mimeType?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
};

type UseFileDownloadReturn = {
  downloadFile: (options: DownloadFileOptions) => Promise<void>;
  downloadData: (options: DownloadDataOptions) => void;
  isDownloading: boolean;
  error: string | null;
  clearError: () => void;
};

function useFileDownload(): UseFileDownloadReturn {
  const [state, setState] = useState<DownloadState>({
    isDownloading: false,
    error: null,
  });

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  const downloadFile = async ({
    url,
    filename,
    onSuccess,
    onError,
    onFinally,
  }: DownloadFileOptions): Promise<void> => {
    setState({ isDownloading: true, error: null });

    try {
      if (!url) {
        throw new Error("URL is required");
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Download failed: ${response.statusText} (${response.status})`
        );
      }

      const blob = await response.blob();

      const finalFilename =
        filename || extractFilenameFromUrl(url) || "download";

      triggerBrowserDownload(blob, finalFilename);

      onSuccess?.();
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to download a file");

      setState((prev) => ({
        ...prev,
        error: error.message,
      }));

      onError?.(error);
    } finally {
      setState((prev) => ({ ...prev, isDownloading: false }));

      onFinally?.();
    }
  };

  const downloadData = ({
    data,
    filename,
    mimeType = "text/plain",
    onSuccess,
    onError,
    onFinally,
  }: DownloadDataOptions): void => {
    setState({ isDownloading: true, error: null });

    try {
      if (!data) {
        throw new Error("Data is required");
      }
      if (!filename) {
        throw new Error("Filename is required");
      }

      const blob = new Blob([data], { type: mimeType });

      triggerBrowserDownload(blob, filename);

      // Success callback
      onSuccess?.();
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to download data");

      setState((prev) => ({
        ...prev,
        error: error.message,
      }));

      // Error callback
      onError?.(error);
    } finally {
      setState((prev) => ({ ...prev, isDownloading: false }));

      // Finally callback
      onFinally?.();
    }
  };

  return {
    downloadFile,
    downloadData,
    isDownloading: state.isDownloading,
    error: state.error,
    clearError,
  };
}

function triggerBrowserDownload(blob: Blob, filename: string): void {
  const blobUrl = window.URL.createObjectURL(blob);

  try {
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    window.URL.revokeObjectURL(blobUrl);
    throw error;
  }
}

function extractFilenameFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
    return filename || null;
  } catch {
    return null;
  }
}

export default useFileDownload;
export type { DownloadFileOptions, DownloadDataOptions, UseFileDownloadReturn };
