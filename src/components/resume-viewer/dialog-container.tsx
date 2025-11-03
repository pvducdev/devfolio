import { Eye, FileUser } from "lucide-react";
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
import { PERSONAL_INFO } from "@/config/personal.ts";

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
            className="size-6 bg-primary text-center text-primary-foreground hover:bg-primary/90"
            size="icon"
          >
            <Eye className="size-3" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-5xl" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{PERSONAL_INFO.resume.fileName}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <ResumeViewer className="h-[70dvh]" url={PERSONAL_INFO.resume.url} />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <DownloadAction
              filename={PERSONAL_INFO.resume.fileName}
              url={PERSONAL_INFO.resume.url}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
