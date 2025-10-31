import { Download, FileUser } from "lucide-react";
import DownloadAction from "@/components/resume-viewer/download-action.tsx";
import ResumeViewer from "@/components/resume-viewer/pdf-viewer.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { RESUME_FILE_NAME, RESUME_URL } from "@/config/personal.ts";

type ResumeReviewerProps = {
  className?: string;
};

export default function DialogContainer({ className }: ResumeReviewerProps) {
  return (
    <div className={className}>
      <FileUser className="size-4" />
      <p className="text-xs">My CV</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="size-6 cursor-pointer bg-primary text-center text-primary-foreground hover:bg-primary/80"
            size="icon"
          >
            <Download className="size-3" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-5xl" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{RESUME_FILE_NAME}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <ResumeViewer className="h-[70dvh]" url={RESUME_URL} />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Close
              </Button>
            </DialogClose>
            <DownloadAction filename={RESUME_FILE_NAME} url={RESUME_URL} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
