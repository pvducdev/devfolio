import { useState } from "react";

interface DownloadState {
  isDownloading: boolean;
  error: string | null;
}

interface DownloadFileOptions {
  url: string;
  filename?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

interface DownloadDataOptions {
  data: BlobPart;
  filename: string;
  mimeType?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

interface UseFileDownloadReturn {
  downloadFile: (options: DownloadFileOptions) => Promise<void>;
  downloadData: (options: DownloadDataOptions) => void;
  isDownloading: boolean;
  error: string | null;
  clearError: () => void;
}

const triggerBrowserDownload = (blob: Blob, filename: string): void => {
  const blobUrl = window.URL.createObjectURL(blob);

  try {
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    link.style.display = "none";

    document.body.append(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    window.URL.revokeObjectURL(blobUrl);
    throw error;
  }
};

const extractFilenameFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const { pathname } = urlObj;
    const filename = pathname.slice(pathname.lastIndexOf("/") + 1);
    return filename || null;
  } catch {
    return null;
  }
};

const useFileDownload = (): UseFileDownloadReturn => {
  const [state, setState] = useState<DownloadState>({
    error: null,
    isDownloading: false,
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
    setState({ error: null, isDownloading: true });

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
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error("Failed to download a file");

      setState((prev) => ({
        ...prev,
        error: normalizedError.message,
      }));

      onError?.(normalizedError);
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
    setState({ error: null, isDownloading: true });

    try {
      if (!data) {
        throw new Error("Data is required");
      }
      if (!filename) {
        throw new Error("Filename is required");
      }

      const blob = new Blob([data], { type: mimeType });

      triggerBrowserDownload(blob, filename);

      onSuccess?.();
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error("Failed to download data");

      setState((prev) => ({
        ...prev,
        error: normalizedError.message,
      }));

      onError?.(normalizedError);
    } finally {
      setState((prev) => ({ ...prev, isDownloading: false }));

      onFinally?.();
    }
  };

  return {
    clearError,
    downloadData,
    downloadFile,
    error: state.error,
    isDownloading: state.isDownloading,
  };
};

export { useFileDownload };
export type { DownloadDataOptions, DownloadFileOptions, UseFileDownloadReturn };
